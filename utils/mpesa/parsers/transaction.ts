import { Transaction } from "@/interfaces";
import { convertToISO } from "../../DateUtils";
import { formatName } from "../../StringUtils";
import { parseNumber } from "../helpers";
import {
  airtimeRegex,
  amountRegex,
  balanceCheckRegex,
  balanceRegex,
  costRegex,
  dateTimeRegex,
  isIncomeRegex,
  nameMatchRegexExpense,
  nameMatchRegexIncome,
  transactionCodeRegex
} from "../regex";

export function parseTransaction(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);
  const transactionCost = parseNumber(message.match(costRegex)?.[1]);

  const dt = message.match(dateTimeRegex);
  const date = dt ? convertToISO(dt[1]) : "";
  const time = dt?.[2] ?? "";

  const isIncome = isIncomeRegex.test(message);

  const nameMatch = isIncome
    ? message.match(nameMatchRegexIncome)
    : message.match(nameMatchRegexExpense);

  const name = nameMatch
    ? formatName(nameMatch[2] || nameMatch[1])
    : undefined;

  const balanceMatch = message.match(balanceRegex);
  const balance = balanceMatch ? parseNumber(balanceMatch[1]) : undefined;

  const isAirtime = airtimeRegex.test(message);
  const isBalanceCheck = balanceCheckRegex.test(message);

  let finalName = name;
  if (isAirtime) finalName = "Safaricom Airtime";
  if (isBalanceCheck) finalName = "Balance Check";

  let finalAmount = amount;
  // Hustler Fund handling: receipts (income) are credited at 95%
  if (isIncome && finalName?.toLowerCase().includes("hustler fund")) {
    finalAmount = amount * 0.95;
  }

  return {
    code: code,
    amount: finalAmount,
    transactionCost: transactionCost,
    balance: balance,
    date: date,
    time: time,

    isIncome: isIncome,

    isReversal: false,
    isWithdrawal: false,
    isDeposit: false,

    name: finalName,
    isBalanceCheck: isBalanceCheck,
  };
}