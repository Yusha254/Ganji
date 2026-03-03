import { ContactStats, TransactionWithDebt } from "@/interfaces";

export function computeContacts(transactions: TransactionWithDebt[]) {
  // Map to aggregate stats per contact
  const contactMap: Record<
    string,
    {
      count: number;
      totalAmount: number;
      totalSent: number;
      totalReceived: number;
      totalFees: number;
    }
  > = {};

  transactions.forEach((tx) => {
    const isExcluded =
      tx.isBalanceCheck ||
      tx.isDebtRepayment ||
      tx.name === "Debt Repayment" ||
      tx.name === "Balance Check";

    if (isExcluded) return;
    const key = tx.name ?? "Unknown";
    if (!contactMap[key]) {
      contactMap[key] = {
        count: 0,
        totalAmount: 0,
        totalSent: 0,
        totalReceived: 0,
        totalFees: 0,
      };
    }

    // Update counts and amounts
    contactMap[key].count += 1;
    contactMap[key].totalAmount += tx.amount;

    if (tx.isIncome) {
      contactMap[key].totalReceived += tx.amount;
    } else {
      contactMap[key].totalSent += tx.amount;
    }

    // Capture M-PESA fee + any debt interest incurred on this transaction
    contactMap[key].totalFees += (tx.transactionCost || 0) + (tx.debt?.interest || 0);
  });

  // Convert map to ContactStats array
  const contacts: ContactStats[] = Object.entries(contactMap).map(
    ([name, stats]) => ({
      name,
      count: stats.count,
      totalAmount: stats.totalAmount,
      avgAmount: stats.totalAmount / stats.count,
      totalSent: stats.totalSent,
      totalReceived: stats.totalReceived,
      avgFee: stats.totalFees / stats.count,
      rank: 0, // will assign rank later
    }),
  );

  // Sort and rank for most frequent contacts
  const mostFrequentContacts = [...contacts]
    .sort((a, b) => b.count - a.count)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  // Sort and rank for highest spending contacts (Expense Only)
  const highestSpendingContacts = [...contacts]
    .map((c) => ({
      ...c,
      totalAmount: c.totalSent ?? 0, // Override for display
    }))
    .filter((c) => c.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  return {
    contactMap,
    mostFrequentContacts,
    highestSpendingContacts,
    totalContacts: Object.keys(contactMap).length,
  };
}
