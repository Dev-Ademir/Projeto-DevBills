import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import { createTransactionSchema } from "../../schema/transaction.schema.js";

const createTransaction = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Você não tem autorização, é obrigatório estar logado" });
  }

  const result = createTransactionSchema.safeParse(request.body);

  if (!result.success) {
    const erroMessage = result.error.message || "Erro inválido";
    return reply.status(400).send({ error: erroMessage });
  }

  const transaction = result.data;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        //userId: userId,
      },
    });
    if (!category) {
      return reply.status(404).send({ message: "Categoria inválida" });
    }

    const parseData = new Date(transaction.date);

    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        date: parseData,
        userId,
      },
      include: {
        category: true,
      },
    });
    reply.status(201).send(newTransaction);
  } catch (error) {
    request.log.error(error, "Erro ao criar transação");
    return reply.status(500).send({ message: "Erro interno do servidor" });
  }
};

export default createTransaction;
