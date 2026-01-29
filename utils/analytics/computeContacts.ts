import { ContactStats, Transaction } from "@/interfaces";

export function computeContacts(transactions: Transaction[]) {
  // Map to aggregate stats per contact
  const contactMap: Record<
    string,
    {
      count: number;
      totalAmount: number;
      totalSent: number;
      totalReceived: number;
    }
  > = {};

  transactions.forEach((tx) => {
    const key = tx.name ?? "Unknown";
    if (!contactMap[key]) {
      contactMap[key] = {
        count: 0,
        totalAmount: 0,
        totalSent: 0,
        totalReceived: 0,
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
      rank: 0, // will assign rank later
    }),
  );

  // Sort and rank for most frequent contacts
  const mostFrequentContacts = [...contacts]
    .sort((a, b) => b.count - a.count)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  // Sort and rank for highest spending contacts
  const highestSpendingContacts = [...contacts]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  return {
    contactMap,
    mostFrequentContacts,
    highestSpendingContacts,
    totalContacts: Object.keys(contactMap).length,
  };
}
