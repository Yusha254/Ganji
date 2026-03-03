import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { Debt, Transaction, TransactionWithDebt } from '../interfaces';

/* ---------------- DATABASE INITIALIZATION ---------------- */

let db: SQLiteDatabase | null = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('ganji.db');

  await db.execSync(`
    PRAGMA journal_mode = WAL;

    -- TRANSACTIONS TABLE
    CREATE TABLE IF NOT EXISTS transactions (
      code TEXT PRIMARY KEY UNIQUE NOT NULL,

      amount REAL NOT NULL,
      transactionCost REAL NOT NULL,
      balance REAL, -- Added balance column

      date TEXT NOT NULL,
      time TEXT NOT NULL,

      isIncome INTEGER NOT NULL,

      isReversal INTEGER NOT NULL,
      isWithdrawal INTEGER NOT NULL,
      isDeposit INTEGER NOT NULL,

      name TEXT
    );

    -- DEBTS TABLE
    CREATE TABLE IF NOT EXISTS debts (
      transactionCode TEXT PRIMARY KEY UNIQUE NOT NULL,

      debtAmount REAL NOT NULL,
      interest REAL NOT NULL,
      outstanding REAL NOT NULL,
      dueDate TEXT NOT NULL,

      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (transactionCode)
        REFERENCES transactions(code)
        ON DELETE CASCADE
    );

    -- INDEXES (performance)
    CREATE INDEX IF NOT EXISTS idx_transactions_code
      ON transactions(code);

    CREATE INDEX IF NOT EXISTS idx_transactions_date
      ON transactions(date);

    CREATE INDEX IF NOT EXISTS idx_debts_code
      ON debts(transactionCode);

    -- SETTINGS TABLE
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY UNIQUE NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // MIGRATION: Add balance column if it doesn't exist
  try {
    await db.execAsync(`ALTER TABLE transactions ADD COLUMN balance REAL;`);
  } catch (e) {
    // Column likely already exists
    console.log("Migration (balance): Column already exists or failed", e);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

/* ---------------- QUERY FUNCTIONS (For Pagination) ---------------- */

export interface AvailableMonth {
  monthKey: string; // YYYY-MM
  label: string;    // August 2025
  count: number;
}

export async function getAvailableMonths(): Promise<AvailableMonth[]> {
  const db = getDb();
  // We extract YYYY-MM from the date string.
  const rows = await db.getAllAsync<{
    monthKey: string;
    count: number;
    income: number;
    expense: number;
  }>(
    `SELECT
      strftime('%Y-%m', date) as monthKey,
      COUNT(*) as count,
      SUM(CASE WHEN isIncome = 1 AND name NOT IN ('Debt Repayment', 'Balance Check') THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN isIncome = 0 AND name NOT IN ('Debt Repayment', 'Balance Check') THEN amount + transactionCost ELSE 0 END) +
      SUM(CASE WHEN name = 'Debt Repayment' THEN transactionCost ELSE 0 END) as expense
     FROM transactions
     GROUP BY monthKey
     ORDER BY monthKey DESC`
  );

  return rows.map(row => {
    const [year, month] = row.monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return {
      monthKey: row.monthKey,
      label,
      count: row.count,
      income: row.income || 0,
      expense: row.expense || 0,
      net: (row.income || 0) - (row.expense || 0)
    };
  });
}

export async function getTransactionsPaginated(
  monthKey: string,
  limit: number,
  offset: number
): Promise<TransactionWithDebt[]> {
  const db = getDb();

  const transactions = await db.getAllAsync<Transaction>(
    `SELECT * FROM transactions
     WHERE strftime('%Y-%m', date) = ?
     ORDER BY date DESC, time DESC
     LIMIT ? OFFSET ?`,
    [monthKey, limit, offset]
  );

  if (transactions.length === 0) return [];

  // Fetch relevant debts for these transactions
  const codes = transactions.map(tx => `'${tx.code}'`).join(',');
  const debts = await db.getAllAsync<Debt>(
    `SELECT * FROM debts WHERE transactionCode IN (${codes})`
  );

  const debtMap = new Map(debts.map(d => [d.transactionCode, d]));

  return transactions.map(tx => {
    // Restore analytics flags based on name (generic flags lost in DB)
    const isDebtRepayment = tx.name === 'Debt Repayment';
    const isBalanceCheck = tx.name === 'Balance Check';

    return {
      ...tx,
      isDebtRepayment,
      isBalanceCheck,
      debt: debtMap.get(tx.code),
    };
  });
}

export async function getCurrentFinancialStatus(): Promise<{ balance: number; outstanding: number }> {
  const db = getDb();

  // Get latest balance across entire history with code tie-breaker
  const balanceRow = await db.getFirstAsync<{ balance: number }>(
    `SELECT balance FROM transactions WHERE balance IS NOT NULL ORDER BY date DESC, time DESC, code DESC LIMIT 1`
  );

  // Get latest outstanding debt by joining with transactions to ensure chronological order
  const debtRow = await db.getFirstAsync<{ outstanding: number }>(
    `
    SELECT d.outstanding 
    FROM debts d
    JOIN transactions t ON d.transactionCode = t.code
    ORDER BY t.date DESC, t.time DESC, t.code DESC
    LIMIT 1
    `
  );

  return {
    balance: balanceRow?.balance ?? 0,
    outstanding: debtRow?.outstanding ?? 0
  };
}

export interface TransactionCounts {
  all: number;
  received: number;
  sent: number;
  debt: number;
}

export async function getTransactionCounts(): Promise<TransactionCounts> {
  const db = getDb();

  const transactions = await db.getAllAsync<{ isIncome: number; isDebt: number }>(
    `SELECT
      isIncome,
      EXISTS(SELECT 1 FROM debts WHERE transactionCode = transactions.code) as isDebt
     FROM transactions`
  );

  const counts: TransactionCounts = {
    all: transactions.length,
    received: 0,
    sent: 0,
    debt: 0
  };

  for (const tx of transactions) {
    if (tx.isDebt) {
      counts.debt++;
    } else if (tx.isIncome) {
      counts.received++;
    } else {
      counts.sent++;
    }
  }

  return counts;
}

/* ---------------- INSERT FUNCTIONS ---------------- */

/* ---------------- TRANSACTIONS ---------------- */

export async function insertTransaction(tx: Transaction) {
  const db = getDb();

  try {
    // Check for existing transaction to prioritize names
    const existing = await db.getFirstAsync<{ name: string }>(
      `SELECT name FROM transactions WHERE code = ?`,
      [tx.code]
    );

    let finalName = tx.name;
    const isGenericName = (n: string | null | undefined) =>
      !n || n === "Fuliza Debt" || n === "M-Shwari Debt" || n === "N/A" || n === "Unknown";

    if (existing && !isGenericName(existing.name) && isGenericName(tx.name)) {
      finalName = existing.name;
    }

    await db.runAsync(
      `
      INSERT OR REPLACE INTO transactions (
        code,
        amount,
        transactionCost,
        balance,
        date,
        time,
        isIncome,
        isReversal,
        isWithdrawal,
        isDeposit,
        name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        tx.code,
        tx.amount,
        tx.transactionCost,
        tx.balance ?? null,
        tx.date,
        tx.time,

        tx.isIncome ? 1 : 0,
        tx.isReversal ? 1 : 0,
        tx.isWithdrawal ? 1 : 0,
        tx.isDeposit ? 1 : 0,

        finalName ?? null,
      ]
    );
  } catch (error) {
    console.error("Insert transaction failed:", error);
    throw error;
  }
}

/* ---------------- DEBTS ---------------- */

export async function insertDebt(debt: Debt) {
  const db = getDb();

  try {
    await db.runAsync(
      `
      INSERT OR IGNORE INTO debts (
        transactionCode,
        debtAmount,
        interest,
        outstanding,
        dueDate
      ) VALUES (?, ?, ?, ?, ?);
      `,
      [
        debt.transactionCode,
        debt.debtAmount,
        debt.interest,
        debt.outstanding,
        debt.dueDate,
      ]
    );
  } catch (error) {
    console.error("Insert debt failed:", error);
    throw error;
  }
}

export async function deleteAllData() {
  const db = getDb();
  await db.execAsync(`
    DELETE FROM transactions;
    DELETE FROM debts;
  `);
}

/* ---------------- SETTINGS ---------------- */

export async function setSetting(key: string, value: string) {
  const db = getDb();
  await db.runAsync(
    `
    INSERT OR REPLACE INTO settings (key, value)
    VALUES (?, ?);
    `,
    [key, value]
  );
}

export async function getSetting(key: string): Promise<string | null> {
  const db = getDb();

  const res = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = ?`,
    [key]
  );

  return res?.value ?? null;
}
