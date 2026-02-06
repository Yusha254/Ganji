import { Transaction } from "@/interfaces";
import { extractDateTimeFromMeta, parseNumber } from "../helpers";
import { amountRegex, balanceRegex, dateTimeRegex, transactionCodeRegex } from "../regex";

export function parseFulizaRepayment(message: string, smsDate?: number): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);

  const dtMatch = message.match(dateTimeRegex);
  const { date, time } = dtMatch
    ? { date: dtMatch[1], time: dtMatch[2] }
    : (smsDate ? extractDateTimeFromMeta(smsDate) : { date: "", time: "" });

  const balanceMatch = message.match(balanceRegex);
  const balance = balanceMatch ? parseNumber(balanceMatch[1]) : undefined;


  return {
    code: code,
    amount: amount,
    transactionCost: 0,
    balance: balance,
    date: date,
    time: time,
    isIncome: false,
    isReversal: false,
    isWithdrawal: false,
    isDeposit: false,
    isTransfer: true,
    name: "Debt Repayment"
  };
}