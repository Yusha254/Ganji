import { buildRangeAnalytics } from "@/utils/analytics/buildRangeAnalytics";

/*------------------- GLOBAL INTERFACES ------------------*/

export interface Transaction {
  code: string;
  amount: number;
  transactionCost: number;
  date: string;
  time: string;

  isIncome: boolean;

  isReversal: boolean;
  isWithdrawal: boolean;
  isDeposit: boolean;

  name?: string;
}

export interface Debt {
  transactionCode: string;

  debtAmount: number;
  interest: number;
  outstanding: number;
  dueDate: string;
}

/*------------------- UTIL/SERVICES TYPES ------------------*/
export type MpesaMessageType =
  | "TRANSACTION"
  | "WITHDRAWAL"
  | "REVERSAL"
  | "FULIZA_DEBT"
  | "FULIZA_REPAYMENT"
  | "DEPOSIT"
  | "UNKNOWN";

export type SmsScanRange = "two_weeks" | "month" | "three_months" | "all";

export type IngestResult = {
  insertedTransactions: number;
  insertedDebts: number;
  skipped: number;
};

export interface RawSms {
  body: string;
  date: number;
}

/*------------------- CONTEXT TYPES ------------------*/
export type AnalyticsRange = "monthly" | "yearly" | "allTime";

export type TransactionContextType = {
  transactions: TransactionWithDebt[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export interface TransactionWithDebt extends Transaction {
  debt?: {
    debtAmount: number;
    interest: number;
    outstanding: number;
    dueDate: string;
  } | null;
}

export interface ContactStats {
  name: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
  totalSent?: number;
  totalReceived?: number;
  rank: number;
}

export type AnalyticsContextValue = {
  range: AnalyticsRange;
  setRange: (range: AnalyticsRange) => void;
  analytics: ReturnType<typeof buildRangeAnalytics>;
  monthlyTransactionCosts: Record<string, number>;
  monthlyTransactionCounts: Record<string, number>;
};

/*------------------- COMPONENT PROPS ------------------*/
export type AutoSmsProps = {
  smsPermission: boolean;
  onToggle: () => void;
};

export interface GradientActionButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

type TransactionType = "received" | "sent" | "debt";

export interface FilterTabsProps {
  activeFilter: TransactionType | "all";
  onFilterChange: (filter: TransactionType | "all") => void;
  counts: {
    all: number;
    received: number;
    sent: number;
    debt: number;
  };
}

export type ManualSmsProps = {
  isScanning: boolean;
  scanComplete: boolean;
  onScan: (value: string) => void;
};

export type TransactionListProps = {
  transactions: TransactionWithDebt[];
  loading?: boolean;
};

/*------------------- HOME COMPONENT PROPS ------------------*/
export interface BalanceCardProps {
  totalReceived: number;
  totalSent: number;
}

export interface MetricCardsProps {
  totalTransactions: number;
  totalTransactionCost: number;
  totalContacts: number;
  rangeLabel: string;
}

export interface TopContactCardProps {
  topContact: ContactStats;
}

export interface RecentActivityProps {
  transactions: TransactionWithDebt[];
}

/*------------------- ANALYTICS COMPONENT PROPS ------------------*/
export interface TransactionCostCardsProps {
  totalTransactionCost: number;
  totalTransactions: number;
  totalDebtCost: number;
}

export interface AverageTransactionCostCardProps {
  averageTransactionCost: number;
}

export interface MonthlyTransactionCostsCardProps {
  monthlyTransactionCosts: Record<string, number>;
  monthlyTransactionCounts: Record<string, number>;
}

export interface MostFrequentContactCardProps {
  topContact: ContactStats;
}

export interface HighestSpendingContactsCardProps {
  contacts: ContactStats[];
}
