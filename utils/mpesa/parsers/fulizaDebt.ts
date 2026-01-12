import { Debt } from "@/interfaces";
import { parseNumber } from "../helpers";
import { debtAmountRegex, dueDateRegex, interestRegex, outstandingRegex, transactionCodeRegex } from "../regex";

export function parseFulizaDebt(message: string): Debt | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const debtAmount = parseNumber(
    message.match(debtAmountRegex)?.[1]
  );

  const interest = parseNumber(
    message.match(interestRegex)?.[1]
  );

  const outstanding = parseNumber(
    message.match(outstandingRegex)?.[1]
  );

  const dueDate =
    message.match(dueDateRegex)?.[1] ?? "";

  return {
    transactionCode: code,
    debtAmount,
    interest,
    outstanding,
    dueDate,
  };
}