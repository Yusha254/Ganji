import { MpesaMessageType } from "@/interfaces";
import { depositRegex, fulizaDebtRegex, fulizaRepaymentRegex, reversalRegex, transactionRegex, withdrawalRegex } from "./regex";

export function classifyMessage(message: string): MpesaMessageType {
  const msg = message.toLowerCase();

  if (reversalRegex.test(msg)) return "REVERSAL";
  if (withdrawalRegex.test(msg)) return "WITHDRAWAL";
  if (fulizaDebtRegex.test(msg)) return "FULIZA_DEBT";
  if (fulizaRepaymentRegex.test(msg)) return "FULIZA_REPAYMENT";
  if (transactionRegex.test(msg)) return "TRANSACTION";
  if (depositRegex.test(msg)) return "DEPOSIT";
  return "UNKNOWN";
}

