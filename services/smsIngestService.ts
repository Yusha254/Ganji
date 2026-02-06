import { insertDebt, insertTransaction } from "../data";
import { Debt, IngestResult, RawSms, Transaction } from "../interfaces";
import { parseMpesaMessage } from "../utils/SmsParser";

export async function ingestSmsMessages(
  messages: RawSms[]
): Promise<IngestResult> {
  let insertedTx = 0;
  let insertedDebt = 0;
  let skipped = 0;

  for (const sms of messages) {

    const parsed = parseMpesaMessage(sms.body, sms.date);


    if (!parsed) {
      skipped++;
      console.log("Failed to parse SMS:", sms.body);
      continue;
    }

    try {
      /* ---- TRANSACTION ---- */
      if ("code" in parsed) {
        await insertTransaction(parsed as Transaction);
        insertedTx++;
      }

      /* ---- DEBT ---- */
      // It might be a Debt object OR a Transaction with a 'debt' property
      const debtData = ("transactionCode" in parsed)
        ? (parsed as Debt)
        : (("debt" in parsed) ? (parsed as any).debt : null);

      if (debtData) {
        await insertDebt(debtData);
        insertedDebt++;
      }
    } catch (err: any) {
      console.log("Insert failed for SMS:", sms.body);
      // duplicate constraint etc
      skipped++;
    }
  }
  console.log(`Ingested: ${insertedTx} transactions, ${insertedDebt} debts, skipped ${skipped} messages.`);

  return {
    insertedTransactions: insertedTx,
    insertedDebts: insertedDebt,
    skipped,
  };
}
