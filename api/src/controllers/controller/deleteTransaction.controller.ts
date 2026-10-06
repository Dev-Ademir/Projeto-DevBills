import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schema/transaction.schema";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;
  const { id } = request.params;

  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Você não tem autorização, é obrigatório estar logado" });
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      return reply.status(400).send({ error: "ID de transação inválida" });
    }

    await prisma.transaction.delete({ where: { id } });

    reply.status(200).send({ message: "Transação deletada com sucesso." });
  } catch {
    request.log.error({ message: "Erro ao deletar transação." });
    reply.status(500).send({ error: "Erro interno do servidor." });
  }
};
