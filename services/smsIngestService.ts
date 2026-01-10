import { insertDebt, insertTransaction } from "../data";
import { Debt, IngestResult, Transaction } from "../interfaces";
import { parseMpesaMessage } from "../utils/SmsParser";

export async function ingestSmsMessages(
  messages: string[]
): Promise<IngestResult> {
  let insertedTx = 0;
  let insertedDebt = 0;
  let skipped = 0;

  for (const sms of messages) {
    const parsed = parseMpesaMessage(sms);

    if (!parsed) {
      skipped++;
      continue;
    }

    try {
      /* ---- TRANSACTION ---- */
      if ("code" in parsed) {
        await insertTransaction(parsed as Transaction);
        insertedTx++;
      }

      /* ---- DEBT ---- */
      if ("transactionCode" in parsed) {
        await insertDebt(parsed as Debt);
        insertedDebt++;
      }
    } catch (err: any) {
      // duplicate constraint etc
      skipped++;
    }
  }

  return {
    insertedTransactions: insertedTx,
    insertedDebts: insertedDebt,
    skipped,
  };
}
