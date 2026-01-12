import { Transaction } from "@/interfaces";
import { amountRegex, dateTimeRegex, nameMatchRegexDeposit, transactionCodeRegex } from "../regex";

export function parseDeposit(message: string): Transaction | null {
  try {
    const codeMatch = message.match(transactionCodeRegex);
    const amountMatch = message.match(amountRegex);
    const dateTimeMatch = message.match(dateTimeRegex);
    const nameMatch = message.match(nameMatchRegexDeposit);

    if (!codeMatch || !amountMatch || !dateTimeMatch) return null;

    const [date, time] = [dateTimeMatch[1], dateTimeMatch[2]];

    return {
      code: codeMatch[1],
      amount: parseFloat(amountMatch[1].replace(/,/g, '')),
      transactionCost: 0,
      date,
      time,
      isIncome: true,
      isReversal: false,
      isWithdrawal: false,
      isDeposit: true,
      name: nameMatch ? nameMatch[1].trim() : undefined,
    };
  } catch (err) {
    console.error("Failed to parse deposit:", err);
    return null;
  }
}
