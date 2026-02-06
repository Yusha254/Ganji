import { TransactionWithDebt } from "@/interfaces";
import { toISODateTime } from "@/utils/DateUtils";

export function computeDebtCosts(
  transactions: TransactionWithDebt[],
  sinceMs?: number
): number {
  if (transactions.length === 0) return 0;

  // 1. Sort transactions chronologically
  const getTs = (tx: TransactionWithDebt) => {
    return new Date(toISODateTime(tx.date, tx.time)).getTime();
  };
  const sorted = [...transactions].sort((a, b) => getTs(a) - getTs(b));

  let totalCost = 0;
  let currentOutstanding = 0;
  let lastDate: number | null = null;
  let daysInDebt = 0; // Track consecutive days in debt

  // Base Tariffs (User provided)
  // Excise Duty is 20% on top.
  const EXCISE_TAX = 1.2;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  function getDailyFee(outstanding: number, dayCounter: number): number {
    if (outstanding <= 100) return 0;

    if (outstanding <= 500) {
      // Free for first 3 days
      if (dayCounter <= 3) return 0;
      return 2.5 * EXCISE_TAX;
    }

    if (outstanding <= 1000) {
      // Free for first 3 days
      if (dayCounter <= 3) return 0;
      return 5.0 * EXCISE_TAX;
    }

    if (outstanding <= 1500) return 18.0 * EXCISE_TAX;
    if (outstanding <= 2500) return 20.0 * EXCISE_TAX;
    if (outstanding <= 70000) return 25.0 * EXCISE_TAX;

    return 25.0 * EXCISE_TAX; // Cap at max known band
  }

  for (const tx of sorted) {
    const txDate = getTs(tx);

    if (lastDate !== null && currentOutstanding > 0) {
      // Calculate days passed (approx 24h blocks)
      const diffMs = txDate - lastDate;
      const daysPassed = Math.floor(diffMs / MS_PER_DAY);

      // Accumulate fee for each day passed
      for (let i = 1; i <= daysPassed; i++) {
        daysInDebt++; // Increment consecutive days
        const dayTimestamp = lastDate + i * MS_PER_DAY;

        // Only add to totalCost if within range
        if (!sinceMs || dayTimestamp >= sinceMs) {
          totalCost += getDailyFee(currentOutstanding, daysInDebt);
        }
      }
    }

    // Process Event
    if (tx.debt) {
      if (currentOutstanding === 0 && tx.debt.outstanding > 0) {
        // Starting new debt cycle?
        daysInDebt = 0; // Reset counter if we were at 0
      }

      // Access Fee: 1% of borrowed amount
      // Only add to totalCost if within range
      if (!sinceMs || txDate >= sinceMs) {
        totalCost += tx.debt.debtAmount * 0.01;
      }
      currentOutstanding = tx.debt.outstanding;
    } else if (
      tx.isTransfer &&
      (tx.name === "Debt Repayment" || tx.isTransfer)
    ) {
      currentOutstanding = Math.max(0, currentOutstanding - tx.amount);
      if (currentOutstanding === 0) {
        daysInDebt = 0; // Cleared debt
      }
    }

    lastDate = txDate;
  }

  // Calculate up to NOW if still in debt
  if (lastDate !== null && currentOutstanding > 0) {
    const now = Date.now();
    const diffMs = now - lastDate;
    const daysPassed = Math.floor(diffMs / MS_PER_DAY);

    for (let i = 1; i <= daysPassed; i++) {
      daysInDebt++;
      const dayTimestamp = lastDate + i * MS_PER_DAY;

      // Only add to totalCost if within range
      if (!sinceMs || dayTimestamp >= sinceMs) {
        totalCost += getDailyFee(currentOutstanding, daysInDebt);
      }
    }
  }

  return totalCost;
}
