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

export type SmsScanRange =
  | "two_weeks"
  | "month"
  | "three_months"
  | "all";

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
  count: number;       // number of transactions
  totalAmount: number; // total amount sent/received
  rank: number;        // ranking
}

export interface AnalyticsData {
  totalSent: number;
  totalReceived: number;
  totalTransactions: number;
  totalTransactionCost: number;
  totalContacts: number;
  mostFrequentContacts: ContactStats[]; // by number of transactions
  highestSpendingContacts: ContactStats[]; // by total amount spent
  averageTransactionCost: number;
  monthlyTransactionCosts: Record<string, number>; // monthKey => total cost
  monthlyTotals: Record<string, { sent: number; received: number }>; // for each month
  last6MonthsTotals: { sent: number; received: number };
  last12MonthsTotals: { sent: number; received: number };
}

export interface AnalyticsContextType {
  analytics: AnalyticsData;
}

/*------------------- COMPONENT PROPS ------------------*/
export type AutoSmsProps = {
  smsPermission: boolean;
  onToggle: () => void;
};

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


