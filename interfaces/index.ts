export interface Transaction {
  code: string;
  amount: number;
  transactionCost: number;
  date: string;
  time: string;

  isIncome: boolean;
  isDebt: boolean;
  debtCost?: number;

  isReversal: boolean;
  isWithdrawal: boolean;
  isDeposit: boolean;

  name?: string;
}
