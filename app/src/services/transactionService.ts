import type { MonthlyItem } from "./../types/transaction";
import type {
  CreateTransactionDTO,
  Transaction,
  TransactionFilter,
  TransactionSummary,
} from "../types/transaction";
import { api } from "./api";

interface GetTransactionsResponse {
  transactions: Transaction[];
}

export const getTransactions = async (
  filter?: Partial<TransactionFilter>
): Promise<GetTransactionsResponse> => {
  const response = await api.get<GetTransactionsResponse>("/transactions", {
    params: filter,
  });
  return response.data;
};
export const getTransactionsSummary = async (filter: {
  month: number;
  year: number;
}): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>("/transactions/summary", { params: filter });
  return response.data;
};

export const getTransactionsMonthly = async (
  month: number,
  year: number,
  months?: number
): Promise<{ history: MonthlyItem[] }> => {
  const response = await api.get("/transactions/historical", {
    params: {
      month,
      year,
      months,
    },
  });
  return response.data;
};

export const deleteTransactions = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const createTransaction = async (
  transactionData: CreateTransactionDTO
): Promise<Transaction> => {
  const response = await api.post<Transaction>("/transactions", transactionData);
  return response.data;
};
