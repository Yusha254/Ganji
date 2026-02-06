// Classification
export const reversalRegex = /reversal of transaction/i;
export const withdrawalRegex = /withdraw ksh/i;
export const fulizaDebtRegex = /fuliza m-pesa amount is ksh/i;
export const fulizaRepaymentRegex = /used to (fully|partially) pay your outstanding fuliza/i;
export const transactionRegex = /confirmed\.?/i;
export const depositRegex = /give ksh/i;
export const nameMatchRegexDeposit = /to\s+(.+?)(?=\sNew M-PESA balance)/i;

// Parsing
export const transactionCodeRegex = /^([A-Z0-9]+)\s*Confirmed/i;
export const amountRegex = /Ksh\s?([\d.]+)/i;
export const costRegex = /Transaction cost\s*Ksh\s?([\d.]+)/i;
export const debtAmountRegex = /Fuliza M-Pesa amount is Ksh\s?([\d.]+)/i;
export const interestRegex = /Access Fee charged Ksh\s?([\d.]+)/i;
export const outstandingRegex = /Outstanding balance is Ksh\s?([\d.]+)/i;
export const dueDateRegex = /to be repaid by\s+(.+?)\./i;
export const isIncomeRegex = /you have received/i;
export const balanceRegex = /balance is Ksh([\d,]+\.\d{2})/i;

export const nameMatchRegexIncome = /from\s+(.+?)(?=\s\d{10}| on)/i;
export const nameMatchRegexExpense = /(sent to|paid to)\s+(.+?)(?=\s\d{10}| on|\.)/i;
export const nameMatchRegexWithdrawal = /-\s*(.+?)(?=\s*on)/i;
export const withdrawalAmountRegex = /Withdraw\s+Ksh\s?([\d.]+)/i;
export const dateTimeRegex = /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+([\d:]+\s*[APMapm]{2})/i;
