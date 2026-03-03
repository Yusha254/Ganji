import { MpesaMessageType } from "@/interfaces";
import { airtimeRegex, balanceCheckRegex, depositRegex, fulizaDebtRegex, fulizaRepaymentRegex, reversalRegex, transactionRegex, withdrawalRegex } from "./regex";

export function classifyMessage(message: string): MpesaMessageType {
  const msg = message.toLowerCase();

  if (reversalRegex.test(msg)) return "REVERSAL";
  if (withdrawalRegex.test(msg)) return "WITHDRAWAL";
  if (fulizaDebtRegex.test(msg)) return "FULIZA_DEBT";
  if (fulizaRepaymentRegex.test(msg)) return "FULIZA_REPAYMENT";
  if (airtimeRegex.test(msg)) return "AIRTIME";
  if (balanceCheckRegex.test(msg)) return "BALANCE_CHECK";
  if (transactionRegex.test(msg)) return "TRANSACTION";
  if (depositRegex.test(msg)) return "DEPOSIT";
  return "UNKNOWN";
}

