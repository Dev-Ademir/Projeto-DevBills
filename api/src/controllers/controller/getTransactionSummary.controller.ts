import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { GetTransactionSummaryQuery } from "../../schema/transaction.schema";
import type { CategorySummary } from "../../types/category.types.js";
import type { TransactionSummary } from "../../types/transaction.types.js";

dayjs.extend(utc);

export const getTransactionSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionSummaryQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Você não tem autorização, é obrigatório estar logado" });
  }

  const { month, year } = request.query;

  if (!month || !year) {
    return reply.status(400).send({ message: "Os parâmetros 'month' e 'year' são obrigatórios" });
  }

  const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
  const endDate = dayjs.utc(`${year}-${month}-01`).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    });

    // ✅ VERIFICAÇÃO DE DADOS VAZIOS - AQUI!
    if (transactions.length === 0) {
      return reply.status(200).send({
        message: "Sem dados gravados neste período",
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        expenseByCategory: [],
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const grupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing = grupedExpenses.get(transaction.categoryId) ?? {
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amount: 0,
          percentage: 0,
        };
        existing.amount += transaction.amount;
        grupedExpenses.set(transaction.categoryId, existing);
        totalExpense += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpense,
      totalIncome,
      balance: Number((totalIncome - totalExpense).toFixed(2)),
      expenseByCategory: Array.from(grupedExpenses.values())
        .map((entry) => ({
          ...entry,
          percentage: Number.parseFloat(((entry.amount / totalExpense) * 100).toFixed(2)),
        }))
        .sort((a, b) => b.amount - a.amount), // Ordena por valor decrescente
    };

    reply.send(summary);
  } catch (error) {
    request.log.error(error, "Erro ao buscar transações");
    reply.status(500).send({ message: "Erro do servidor" });
  }
};
