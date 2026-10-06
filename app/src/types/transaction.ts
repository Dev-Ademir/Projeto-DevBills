import type { Category, CategorySummary } from "./category";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: string | Date;
  type: TransactionType;
  categoryId?: string;
  category: Category;
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: string | Date;
  type: TransactionType;
  categoryId?: string;
}

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: CategorySummary[];
}

export interface MonthlyItem {
  name: string;
  expenses: number;
  income: number;
}
