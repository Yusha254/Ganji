import { Transaction } from "@/interfaces";
import { extractDateTimeFromMeta, parseNumber } from "../helpers";
import { amountRegex, transactionCodeRegex } from "../regex";

export function parseFulizaRepayment(message: string, smsDate?: number): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);
  const { date, time } = smsDate
  ? extractDateTimeFromMeta(smsDate)
  : { date: "", time: "" };


  return {
    code: code,
    amount: amount,
    transactionCost: 0,
    date: date,
    time: time,
    isIncome: false,
    isReversal: false,
    isWithdrawal: false,
    isDeposit: false,
    name: "Debt Repayment"
  };
}