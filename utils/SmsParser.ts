

import { Debt, Transaction } from "../interfaces";
import { classifyMessage } from "./mpesa/classifier";
import { normalizeSms } from "./mpesa/helpers";
import { parseFulizaDebt } from "./mpesa/parsers/fulizaDebt";
import { parseFulizaRepayment } from "./mpesa/parsers/fulizaRepayment";
import { parseDeposit } from "./mpesa/parsers/parseDeposit";
import { parseReversal } from "./mpesa/parsers/reversal";
import { parseTransaction } from "./mpesa/parsers/transaction";
import { parseWithdrawal } from "./mpesa/parsers/withdrawal";

export function parseMpesaMessage(
  message: string,
  smsDate?: number
): Transaction | Debt | (Transaction & { debt: Debt }) | null {
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
      return parseFulizaDebt(normalized, smsDate);

    case "FULIZA_REPAYMENT":
      return parseFulizaRepayment(normalized, smsDate);

    case "DEPOSIT":
      return parseDeposit(normalized);

    default:
      return null;
  }
}
