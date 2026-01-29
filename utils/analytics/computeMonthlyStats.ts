// utils/analytics/computeMonthlyStats.ts
import { Transaction } from "@/interfaces";

export function computeMonthlyStats(transactions: Transaction[]) {
  const monthlyTransactionCosts: Record<string, number> = {};
  const monthlyTransactionCounts: Record<string, number> = {};

  for (const tx of transactions) {
    const monthKey = tx.date.slice(0, 7); // "YYYY-MM"

    monthlyTransactionCosts[monthKey] =
      (monthlyTransactionCosts[monthKey] ?? 0) + tx.transactionCost;

    monthlyTransactionCounts[monthKey] =
      (monthlyTransactionCounts[monthKey] ?? 0) + 1;
  }

  return {
    monthlyTransactionCosts,
    monthlyTransactionCounts,
  };
}
