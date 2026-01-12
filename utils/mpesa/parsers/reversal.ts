import { Transaction } from "@/interfaces";
import { convertToISO } from "../../DateUtils";
import { parseNumber } from "../helpers";
import { amountRegex, dateTimeRegex, transactionCodeRegex } from "../regex";

export function parseReversal(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);

  const dt = message.match(dateTimeRegex);

  return {
    code,
    amount,
    transactionCost: 0,
    date: dt ? convertToISO(dt[1]) : "",
    time: dt?.[2] ?? "",

    isIncome: true,

    isReversal: true,
    isWithdrawal: false,
    isDeposit: false,

    name: "Reversal",
  };
}