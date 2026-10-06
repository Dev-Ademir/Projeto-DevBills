import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, { message: "A descrição é obrigatória" }),
  amount: z.number().positive({ message: "O valor deve ser positivo" }),
  date: z.coerce.date({ message: "Data inválida" }),
  categoryId: z.string().refine(isValidObjectId, { message: "ID da categoria inválido" }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    message: "Tipo de transação inválido",
  }),
});

export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      message: "Tipo de transação inválido",
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, { message: "ID da categoria inválido" })
    .optional(),
});

export const getTransactionSummarySchema = z.object({
  month: z.string({ message: "O mês é obrigatório" }),
  year: z.string({ message: "O ano é obrigatório" }),
});

export const getTransactionHistoricalSchema = z.object({
  month: z.coerce.number().min(1).max(12, { message: "O mês deve estar entre 1 e 12" }),
  year: z.coerce.number().min(2000).max(2100, { message: "O ano deve estar entre 2000 e 2100" }),
  months: z.coerce
    .number()
    .min(1)
    .max(12, { message: "O número de meses deve estar entre 1 e 12" })
    .optional(),
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: "ID da transação inválido" }),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionSummaryQuery = z.infer<typeof getTransactionSummarySchema>;
export type GetTransactionHistoricalQuery = z.infer<typeof getTransactionHistoricalSchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
