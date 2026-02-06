import { Transaction } from "@/interfaces";
import { convertToISO } from "../../DateUtils";
import { parseNumber } from "../helpers";
import { amountRegex, balanceRegex, dateTimeRegex, transactionCodeRegex } from "../regex";

export function parseReversal(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);

  const dt = message.match(dateTimeRegex);
  const balanceMatch = message.match(balanceRegex);
  const balance = balanceMatch ? parseNumber(balanceMatch[1]) : undefined;

  return {
    code,
    amount,
    transactionCost: 0,
    balance,
    date: dt ? convertToISO(dt[1]) : "",
    time: dt?.[2] ?? "",

    isIncome: true,

    isReversal: true,
    isWithdrawal: false,
    isDeposit: false,

    name: "Reversal",
  };
}