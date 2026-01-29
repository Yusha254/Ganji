import { TransactionWithDebt } from "@/interfaces";

export function computeDebtCosts(transactions: TransactionWithDebt[]) {
  let totalDebtCost = 0;

  transactions.forEach((tx) => {
    if (!tx.debt) return;
    if (tx.debt) {
      const { debtAmount, outstanding } = tx.debt;

      // Access fee: 1% of debtAmount
      const accessFee = debtAmount * 0.01;

      // Daily Maintenance Fee based on outstanding
      let dailyFee = 0;

      if (outstanding > 0) {
        if (outstanding <= 100) dailyFee = 0;
        else if (outstanding <= 500)
          dailyFee = 2.5; // assume after first 3 days
        else if (outstanding <= 1000) dailyFee = 5;
        else if (outstanding <= 1500) dailyFee = 18;
        else if (outstanding <= 2500) dailyFee = 20;
        else if (outstanding <= 70000) dailyFee = 25;
      }

      // Total charges for this debt
      totalDebtCost += accessFee + dailyFee;
    }
  });

  return totalDebtCost;
}
