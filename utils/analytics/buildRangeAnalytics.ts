import { Transaction } from "@/interfaces";
import { computeContacts } from "./computeContacts";
import { computeTotals } from "./computeTotals";
import { filterTransactionsByRange } from "./timeFilters";

export const buildRangeAnalytics = (
  transactions: Transaction[],
  range: "monthly" | "yearly" | "allTime",
) => {
  const scopedTransactions =
    range === "allTime"
      ? transactions
      : filterTransactionsByRange(transactions, range);

  return {
    totals: computeTotals(scopedTransactions),
    contacts: computeContacts(scopedTransactions),
    transactions: scopedTransactions.length,
  };
};
