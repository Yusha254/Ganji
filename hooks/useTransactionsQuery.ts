import { getAvailableMonths, getTransactionsPaginated } from "@/data";
import { TransactionWithDebt } from "@/interfaces";
import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 30;

export function useAvailableMonths() {
    return useQuery({
        queryKey: ["availableMonths"],
        queryFn: getAvailableMonths,
    });
}

export interface InfiniteTransactionsPage {
    transactions: TransactionWithDebt[];
    monthKey: string;
    offset: number;
}

export type InfiniteTransactionsParam = { monthKey: string; offset: number };

export function useInfiniteTransactions() {
    const { data: months } = useAvailableMonths();

    return useInfiniteQuery<
        InfiniteTransactionsPage,
        Error,
        InfiniteData<InfiniteTransactionsPage, InfiniteTransactionsParam>,
        readonly ["transactions", "infinite"],
        InfiniteTransactionsParam
    >({
        queryKey: ["transactions", "infinite"] as const,
        queryFn: async ({ pageParam }) => {
            const { monthKey, offset } = pageParam;
            const transactions = await getTransactionsPaginated(monthKey, PAGE_SIZE, offset);
            return {
                transactions,
                monthKey,
                offset,
            };
        },
        initialPageParam: { monthKey: "", offset: 0 },
        getNextPageParam: (lastPage) => {
            if (!months || months.length === 0) return undefined;

            if (lastPage.monthKey === "") {
                return { monthKey: months[0].monthKey, offset: 0 };
            }

            if (lastPage.transactions.length === PAGE_SIZE) {
                return { monthKey: lastPage.monthKey, offset: lastPage.offset + PAGE_SIZE };
            }

            const currentIndex = months.findIndex(m => m.monthKey === lastPage.monthKey);
            if (currentIndex >= 0 && currentIndex < months.length - 1) {
                return { monthKey: months[currentIndex + 1].monthKey, offset: 0 };
            }

            return undefined;
        },
        enabled: !!months && months.length > 0,
    });
}
