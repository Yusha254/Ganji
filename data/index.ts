import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { Debt, Transaction } from '../interfaces';

/* ---------------- DATABASE INITIALIZATION ---------------- */

let db: SQLiteDatabase | null = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('ganji.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- TRANSACTIONS TABLE
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,

      amount REAL NOT NULL,
      transactionCost REAL NOT NULL,

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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transactionCode TEXT UNIQUE NOT NULL,

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

    CREATE INDEX IF NOT EXISTS idx_debts_code
      ON debts(transactionCode);
  `);
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

/* ---------------- INSERT FUNCTIONS ---------------- */

/* ---------------- TRANSACTIONS ---------------- */

export async function insertTransaction(tx: Transaction) {
  const db = getDb();

  try {
    await db.runAsync(
      `
      INSERT OR IGNORE INTO transactions (
        code,
        amount,
        transactionCost,
        date,
        time,
        isIncome,
        isReversal,
        isWithdrawal,
        isDeposit,
        name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        tx.code,
        tx.amount,
        tx.transactionCost,
        tx.date,
        tx.time,

        tx.isIncome ? 1 : 0,
        tx.isReversal ? 1 : 0,
        tx.isWithdrawal ? 1 : 0,
        tx.isDeposit ? 1 : 0,

        tx.name ?? null,
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