import { TransactionWithDebt } from "@/interfaces";
import { computeDebtCosts } from "./computeDebtCosts";

export function computeTotals(transactions: TransactionWithDebt[]) {
  let totalSent = 0;
  let totalReceived = 0;
  let totalTransactionCost = 0;

  transactions.forEach((tx) => {
    if (tx.isBalanceCheck || tx.name === "Balance Check") return;

    if (tx.isIncome) {
      totalReceived += tx.amount;
    } else {
      // For debt repayment, the "amount" is principal payback (not an expense)
      // Only the transactionCost (interest/fee) is the real expense here.
      if (tx.isDebtRepayment || tx.name === "Debt Repayment") {
        // Principal is already excluded from totalSent by return/if logic
      } else {
        totalSent += tx.amount;
      }
    }

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
