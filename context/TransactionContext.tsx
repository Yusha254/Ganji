import { getDb } from "@/data";
import { Debt, Transaction, TransactionContextType, TransactionWithDebt } from "@/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

const TransactionContext =
  createContext<TransactionContextType | null>(null);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<TransactionWithDebt[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const db = getDb();

      const transactions = await db.getAllAsync<Transaction>(
        `SELECT * FROM transactions
         ORDER BY date DESC, time DESC`
      );

      const debts = await db.getAllAsync<Debt>(
        `SELECT * FROM debts`
      );
      // Map debts by transactionCode
        const debtMap = new Map(
            debts.map(d => [d.transactionCode, d])
        );

        const merged: TransactionWithDebt[] = transactions.map(tx => ({
            ...tx,
            debt: debtMap.get(tx.code),
        }));


        setTransactions(merged);
    } catch (err) {
      console.error("Fetch transactions failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        refresh: fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

/* ---------- Hook ---------- */

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error(
      "useTransactions must be used inside TransactionProvider"
    );
  }
  return ctx;
}
