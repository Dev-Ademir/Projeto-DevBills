import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { GetTransactionHistoricalQuery } from "../../schema/transaction.schema.js";
import "dayjs/locale/pt-BR";

dayjs.locale("pt-BR");
dayjs.extend(utc);

export const getTransactionHistorical = async (
  request: FastifyRequest<{ Querystring: GetTransactionHistoricalQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Você não tem autorização, é obrigatório estar logado" });
  }

  const { month, year, months = 6 } = request.query;

  const baseData = new Date(year, month - 1, 1);

  const startDate = dayjs
    .utc(baseData)
    .subtract(months - 1, "month")
    .startOf("month")
    .toDate();

  const endDate = dayjs.utc(baseData).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
    });

    const monthlyDate = Array.from({ length: months }, (_, i) => {
      const date = dayjs.utc(baseData).subtract(months - 1 - i, "month");

      return {
        name: date.format("MMM, YYYY"),
        income: 0,
        expenses: 0,
      };
    });

    transactions.forEach((transaction) => {
      const monthKey = dayjs.utc(transaction.date).format("MMM, YYYY");

      const bucket = monthlyDate.find((m) => m.name === monthKey);

      if (!bucket) return;
      if (transaction.type === "income") {
        bucket.income += transaction.amount;
      } else {
        bucket.expenses += transaction.amount;
      }
    });

    reply.send({ history: monthlyDate });
    console.log(monthlyDate);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: "Erro ao buscar histórico de transações" });
  }
};
