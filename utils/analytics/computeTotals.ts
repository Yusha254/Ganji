import { TransactionWithDebt } from "@/interfaces";
import { computeDebtCosts } from "./computeDebtCosts";

export function computeTotals(transactions: TransactionWithDebt[]) {
  let totalSent = 0;
  let totalReceived = 0;
  let totalTransactionCost = 0;

  transactions.forEach((tx) => {
    if (tx.isIncome) totalReceived += tx.amount;
    else totalSent += tx.amount;

    totalTransactionCost += tx.transactionCost ?? 0;
  });

  const totalDebtCost = computeDebtCosts(transactions);

  return {
    totalSent,
    totalReceived,
    totalTransactionCost,
    totalTransactions: transactions.length,
    averageTransactionCost:
      transactions.length > 0 ? totalTransactionCost / transactions.length : 0,
    totalDebtCost,
  };
}
