import { Debt, MpesaMessageType, Transaction } from "../interfaces";
import { convertToISO } from "./DateUtils";
import { formatName } from "./StringUtils";

/* ---------------- REGEX ---------------- */

const transactionCodeRegex = /^([A-Z0-9]+)\s+Confirmed/i;
const amountRegex = /Ksh\s?([\d,]+\.\d{2})/i;
const costRegex = /Transaction cost,\s*Ksh\s?([\d,]+\.\d{2})/i;

const dateTimeRegex =
  /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+([\d:]+\s*[APMapm]{2})/;

/* ---------------- HELPERS ---------------- */

export function normalizeSms(message: string): string {
  return message
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

function parseNumber(value?: string): number {
  return value ? parseFloat(value.replace(/,/g, "")) : 0;
}

/* ---------------- CLASSIFIER ---------------- */

function classifyMessage(message: string): MpesaMessageType {
  if (/reversal of transaction/i.test(message)) return "REVERSAL";
  if (/withdraw ksh/i.test(message)) return "WITHDRAWAL";
  if (/fuliza m-pesa amount is/i.test(message)) return "FULIZA_DEBT";
  if (/used to partially pay your outstanding fuliza/i.test(message))
    return "FULIZA_REPAYMENT";
  if (/confirmed\. ksh/i.test(message)) return "TRANSACTION";

  return "UNKNOWN";
}

/* ---------------- PARSERS ---------------- */

function parseTransaction(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(message.match(amountRegex)?.[1]);
  const transactionCost = parseNumber(message.match(costRegex)?.[1]);

  const dt = message.match(dateTimeRegex);
  const date = dt ? convertToISO(dt[1]) : "";
  const time = dt?.[2] ?? "";

  const isIncome = /you have received/i.test(message);

  const nameMatch = isIncome
    ? message.match(/from\s+(.+?)(?=\s\d{10}| on)/i)
    : message.match(/sent to\s+(.+?)(?=\s\d{10}| on|\.)/i);

  return {
    code,
    amount,
    transactionCost,
    date,
    time,

    isIncome,

    isReversal: false,
    isWithdrawal: false,
    isDeposit: false,

    name: nameMatch ? formatName(nameMatch[1]) : undefined,
  };
}

function parseWithdrawal(message: string): Transaction | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(
    message.match(/Withdraw\s+Ksh\s?([\d,]+\.\d{2})/i)?.[1]
  );

  const transactionCost = parseNumber(message.match(costRegex)?.[1]);

  const dt = message.match(dateTimeRegex);
  const date = dt ? convertToISO(dt[1]) : "";
  const time = dt?.[2] ?? "";

  const nameMatch = message.match(/-\s*(.+?)(?=\s*on)/i);

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

function parseReversal(message: string): Transaction | null {
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

/* ---------------- FULIZA ---------------- */

function parseFulizaDebt(message: string): Debt | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const debtAmount = parseNumber(
    message.match(/Fuliza M-Pesa amount is Ksh\s?([\d,]+\.\d{2})/i)?.[1]
  );

  const interest = parseNumber(
    message.match(/Access Fee charged Ksh\s?([\d,]+\.\d{2})/i)?.[1]
  );

  const outstanding = parseNumber(
    message.match(/Outstanding balance is Ksh\s?([\d,]+\.\d{2})/i)?.[1]
  );

  const dueDate =
    message.match(/to be repaid by\s+(.+?)\./i)?.[1] ?? "";

  return {
    transactionCode: code,
    debtAmount,
    interest,
    outstanding,
    dueDate,
  };
}

function parseFulizaRepayment(message: string): Debt | null {
  const code = message.match(transactionCodeRegex)?.[1];
  if (!code) return null;

  const amount = parseNumber(
    message.match(/Ksh\s?([\d,]+\.\d{2}) from your M-PESA has been used/i)?.[1]
  );

  return {
    transactionCode: code,
    debtAmount: 0,
    interest: 0,
    outstanding: -amount,
    dueDate: "",
  };
}

/* ---------------- MAIN ---------------- */

export function parseMpesaMessage(
  message: string
): Transaction | Debt | null {
  if (!message) return null;

  const normalized = normalizeSms(message);
  const type = classifyMessage(normalized);

  switch (type) {
    case "TRANSACTION":
      return parseTransaction(normalized);

    case "WITHDRAWAL":
      return parseWithdrawal(normalized);

    case "REVERSAL":
      return parseReversal(normalized);

    case "FULIZA_DEBT":
      return parseFulizaDebt(normalized);

    case "FULIZA_REPAYMENT":
      return parseFulizaRepayment(normalized);

    default:
      return null;
  }
}
