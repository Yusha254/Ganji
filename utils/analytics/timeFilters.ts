import { Transaction } from "@/interfaces";
import { isAfter, toISODateTime } from "@/utils/DateUtils";

const DAYS = {
  monthly: 30,
  yearly: 365,
};

export const filterTransactionsByRange = (
  transactions: Transaction[],
  range: "monthly" | "yearly",
) => {
  const since = new Date();
  since.setDate(since.getDate() - DAYS[range]);

  return transactions.filter((tx) => {
    // tx.date is DD/MM/YYYY or YYYY-MM-DD
    // tx.time is HH:MM AM/PM or HH:MM:SS
    // toISODateTime handles both formats and returns ISO string
    const isoString = toISODateTime(tx.date, tx.time);
    const date = new Date(isoString);

    return isAfter(date, since);
  });
};
