import { Debt, Transaction } from "@/interfaces";
import { extractDateTimeFromMeta, parseNumber } from "../helpers";
import { dateTimeRegex, debtAmountRegex, dueDateRegex, interestRegex, outstandingRegex, transactionCodeRegex } from "../regex";

export function parseFulizaDebt(message: string, smsDate?: number): (Transaction & { debt: Debt }) | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const debtAmount = parseNumber(message.match(debtAmountRegex)?.[1]);
  const interest = parseNumber(message.match(interestRegex)?.[1]);
  const outstanding = parseNumber(message.match(outstandingRegex)?.[1]);
  const dueDate = message.match(dueDateRegex)?.[1] ?? "";

  const dtMatch = message.match(dateTimeRegex);
  const { date, time } = dtMatch
    ? { date: dtMatch[1], time: dtMatch[2] } // Simplify for now, ideally convertToISO
    : (smsDate ? extractDateTimeFromMeta(smsDate) : { date: "", time: "" });

  return {
    code,
    amount: debtAmount,
    transactionCost: interest,
    balance: 0,
    date,
    time,
    isIncome: false,
    isReversal: false,
    isWithdrawal: false,
    isDeposit: false,
    name: "Fuliza Debt",
    debt: {
      transactionCode: code,
      debtAmount,
      interest,
      outstanding,
      dueDate,
    }
  };
}