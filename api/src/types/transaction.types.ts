import type { TransactionType } from "@prisma/client";
import type { CategorySummary } from "./category.types.js";

export interface TransactionFilters {
  userId: string;
  date?: {
    gte: Date;
    lte: Date;
  };
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: CategorySummary[];
}
