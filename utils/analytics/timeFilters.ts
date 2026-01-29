import { Transaction } from "@/interfaces";
import { isAfter } from "@/utils/DateUtils";

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
    const date = new Date(`${tx.date}T${tx.time ?? "00:00:00"}`);
    return isAfter(date, since);
  });
};
