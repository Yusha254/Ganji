import { Transaction } from "@/interfaces";
import { convertToISO } from "../../DateUtils";
import { formatName } from "../../StringUtils";
import { parseNumber } from "../helpers";
import { costRegex, dateTimeRegex, nameMatchRegexWithdrawal, transactionCodeRegex, withdrawalAmountRegex } from "../regex";

export function parseWithdrawal(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(
    message.match(withdrawalAmountRegex)?.[1]
  );

  const transactionCost = parseNumber(message.match(costRegex)?.[1]);

  const dt = message.match(dateTimeRegex);
  const date = dt ? convertToISO(dt[1]) : "";
  const time = dt?.[2] ?? "";


  const nameMatch = message.match(nameMatchRegexWithdrawal);

  return {
    code,
    amount,
    transactionCost,
    date,
    time,

    isIncome: false,

    isReversal: false,
    isWithdrawal: true,
    isDeposit: false,

    name: nameMatch ? formatName(nameMatch[1]) : undefined,
  };
}