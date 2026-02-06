import { Transaction } from "@/interfaces";
import { amountRegex, balanceRegex, dateTimeRegex, nameMatchRegexDeposit, transactionCodeRegex } from "../regex";

export function parseDeposit(message: string): Transaction | null {
  try {
    const codeMatch = message.match(transactionCodeRegex);
    const amountMatch = message.match(amountRegex);
    const dateTimeMatch = message.match(dateTimeRegex);
    const nameMatch = message.match(nameMatchRegexDeposit);

    if (!codeMatch || !amountMatch || !dateTimeMatch) return null;

    const [date, time] = [dateTimeMatch[1], dateTimeMatch[2]];
    const balanceMatch = message.match(balanceRegex);
    const balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : undefined;

    return {
      code: codeMatch[1],
      amount: parseFloat(amountMatch[1].replace(/,/g, '')),
      transactionCost: 0,
      balance,
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
