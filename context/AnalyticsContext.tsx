//where exactly should i use totalDebtCost here

import { useTransactions } from "@/context/TransactionContext";
import { AnalyticsContextValue, AnalyticsRange } from "@/interfaces";
import { buildRangeAnalytics } from "@/utils/analytics/buildRangeAnalytics";
import { computeDebtCosts } from "@/utils/analytics/computeDebtCosts";
import { computeMonthlyStats } from "@/utils/analytics/computeMonthlyStats";
import React, { createContext, useContext, useMemo, useState } from "react";

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
  undefined,
);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("AnalyticsProvider mounted");

  const { transactions } = useTransactions();
  console.log("Transactions:", transactions);
  const [range, setRange] = useState<AnalyticsRange>("monthly");

  const safeTransactions = transactions ?? [];

  // Build general analytics based on current range
  const analytics = useMemo(() => {
    const baseAnalytics = buildRangeAnalytics(safeTransactions, range);

    // Compute Debt Costs
    const totalDebtCost = computeDebtCosts(transactions);

    return {
      ...baseAnalytics,
      totals: {
        ...baseAnalytics.totals,
        totalDebtCost,
      },
    };
  }, [transactions, range]);

  // Compute monthly stats separately
  const { monthlyTransactionCosts, monthlyTransactionCounts } = useMemo(
    () => computeMonthlyStats(transactions),
    [transactions],
  );

  return (
    <AnalyticsContext.Provider
      value={{
        range,
        setRange,
        analytics,
        monthlyTransactionCosts,
        monthlyTransactionCounts,
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
