import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { GetTransactionsQuery } from "../../schema/transaction.schema.js";
import type { TransactionFilters } from "../../types/transaction.types.js";

dayjs.extend(utc);

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Você não tem autorização, é obrigatório estar logado" });
  }

  const { month, year, type, categoryId } = request.query;

  const filters: TransactionFilters = { userId };

  if (month && year) {
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(`${year}-${month}-01`).endOf("month").toDate();
    filters.date = { gte: startDate, lte: endDate };
  }
  if (type) {
    filters.type = type;
  }
  if (categoryId) {
    filters.categoryId = categoryId;
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
          },
        },
      },
    });
    reply.status(200).send({ transactions });
  } catch (error) {
    request.log.error(error, "Erro ao buscar transações");
    reply.status(500).send({ message: "Erro do servidor" });
  }
};
