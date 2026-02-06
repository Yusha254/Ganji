//where exactly should i use totalDebtCost here

import { useSettings } from "@/context/SettingsContext";
import { useTransactions } from "@/context/TransactionContext";
import { AnalyticsContextValue, AnalyticsRange } from "@/interfaces";
import { buildRangeAnalytics } from "@/utils/analytics/buildRangeAnalytics";
import { computeDebtCosts } from "@/utils/analytics/computeDebtCosts";
import { computeMonthlyStats } from "@/utils/analytics/computeMonthlyStats";
import React, { createContext, useContext, useMemo } from "react";

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
  undefined,
);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const { transactions } = useTransactions();
  const { dashboardType } = useSettings();

  const safeTransactions = transactions ?? [];

  // Build general analytics based on current range
  const analytics = useMemo(() => {
    // Map dashboardType to AnalyticsRange if needed, or if they are identical types:
    // dashboardType is "monthly" | "yearly" | "alltime"
    // AnalyticsRange is "monthly" | "yearly" | "allTime" -> Note the case difference in 'allTime'

    let range: AnalyticsRange = "monthly";
    let sinceMs: number | undefined = undefined;
    const now = new Date();

    if (dashboardType === "monthly") {
      range = "monthly";
      sinceMs = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    } else if (dashboardType === "yearly") {
      range = "yearly";
      sinceMs = now.getTime() - 365 * 24 * 60 * 60 * 1000;
    } else if (dashboardType === "alltime") {
      range = "allTime";
      sinceMs = undefined;
    }

    const baseAnalytics = buildRangeAnalytics(safeTransactions, range);

    // Compute Debt Costs based on range
    const totalDebtCost = computeDebtCosts(safeTransactions, sinceMs);

    return {
      ...baseAnalytics,
      totals: {
        ...baseAnalytics.totals,
        totalDebtCost,
      },
    };
  }, [transactions, dashboardType]);

  // Compute monthly stats separately
  const { monthlyTransactionCosts, monthlyTransactionCounts } = useMemo(
    () => computeMonthlyStats(transactions),
    [transactions],
  );

  const headBalance = useMemo(() => {
    if (safeTransactions.length === 0) return 0;

    // Transactions are already sorted date DESC, time DESC in context
    for (const tx of safeTransactions) {
      if (tx.balance !== undefined && tx.balance !== null) {
        // user requirement: if balance is 0 and in debt, show -outstanding
        if (tx.balance === 0 && tx.debt && tx.debt.outstanding > 0) {
          return -tx.debt.outstanding;
        }
        return tx.balance;
      }
      // If message itself is a debt record (like Fuliza Debt) but balance field missing
      if (tx.debt && tx.debt.outstanding > 0) {
        return -tx.debt.outstanding;
      }
    }
    return 0;
  }, [safeTransactions]);

  return (
    <AnalyticsContext.Provider
      value={{
        range: dashboardType === "alltime" ? "allTime" : dashboardType,
        setRange: () => { }, // No-op, driven by settings
        analytics,
        monthlyTransactionCosts,
        monthlyTransactionCounts,
        headBalance,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return ctx;
};
