
import { useTransactions } from "@/context/TransactionContext";
import { AnalyticsContextType } from "@/interfaces";
import { isAfter, monthsAgo, toISODateTime } from "@/utils/DateUtils";
import React, { createContext, useContext, useMemo } from "react";

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { transactions } = useTransactions();
  const analytics = useMemo(() => {
    let totalSent = 0;
    let totalReceived = 0;
    let totalTransactionCost = 0;
    let contactMap: Record<string, { count: number; totalAmount: number }> = {};
    let monthlyCosts: Record<string, number> = {};
    let monthlyTotals: Record<string, { sent: number; received: number }> = {};

    const now = new Date();
    const sixMonthsAgo = monthsAgo(6);
    const twelveMonthsAgo = monthsAgo(12);


    let last6MonthsTotals = { sent: 0, received: 0 };
    let last12MonthsTotals = { sent: 0, received: 0 };

    transactions.forEach((tx) => {
      const date = new Date(toISODateTime(`${tx.date}T${tx.time || "00:00:00"}`));
      
      // Totals
      if (tx.isIncome) {
        totalReceived += tx.amount;
        if (isAfter(date, sixMonthsAgo)) last6MonthsTotals.received += tx.amount;
        if (isAfter(date, twelveMonthsAgo)) last12MonthsTotals.received += tx.amount;
      } else {
        totalSent += tx.amount;
        if (isAfter(date, sixMonthsAgo)) last6MonthsTotals.sent += tx.amount;
        if (isAfter(date, twelveMonthsAgo)) last12MonthsTotals.sent += tx.amount;
      }

      // Transaction costs (excluding debt costs)
      totalTransactionCost += tx.transactionCost ?? 0;

      // Monthly transaction cost
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      monthlyCosts[monthKey] = (monthlyCosts[monthKey] || 0) + (tx.transactionCost ?? 0);

      // Monthly totals
      if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = { sent: 0, received: 0 };
      if (tx.isIncome) monthlyTotals[monthKey].received += tx.amount;
      else monthlyTotals[monthKey].sent += tx.amount;

      // Contacts
      const contactKey = tx.name ?? "Unknown";
      if (!contactMap[contactKey]) contactMap[contactKey] = { count: 0, totalAmount: 0 };
      contactMap[contactKey].count += 1;
      contactMap[contactKey].totalAmount += tx.amount;
    });

    // Compute most frequent contacts by count
    const mostFrequentContacts = Object.entries(contactMap)
      .map(([name, stats]) => ({ name, count: stats.count, totalAmount: stats.totalAmount, rank: 0 }))
      .sort((a, b) => b.count - a.count)
      .map((c, idx) => ({ ...c, rank: idx + 1 }));

    // Highest spending contacts by amount
    const highestSpendingContacts = Object.entries(contactMap)
      .map(([name, stats]) => ({ name, count: stats.count, totalAmount: stats.totalAmount, rank: 0 }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .map((c, idx) => ({ ...c, rank: idx + 1 }));

    const averageTransactionCost = transactions.length > 0 ? totalTransactionCost / transactions.length : 0;

    return {
      totalSent,
      totalReceived,
      totalTransactions: transactions.length,
      totalTransactionCost,
      totalContacts: Object.keys(contactMap).length,
      mostFrequentContacts,
      highestSpendingContacts,
      averageTransactionCost,
      monthlyTransactionCosts: monthlyCosts,
      monthlyTotals,
      last6MonthsTotals,
      last12MonthsTotals,
    };
  }, [transactions]);

  return <AnalyticsContext.Provider value={{ analytics }}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error("useAnalytics must be used within an AnalyticsProvider");
  return context.analytics;
};
