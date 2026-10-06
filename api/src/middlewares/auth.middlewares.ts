import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "firebase-admin/auth";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    reply
      .code(401)
      .send({ error: "Token de autorização fornecida de forma errado. ERRO DE CREDÊNCIAIS" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    request.userId = decodedToken.uid;
  } catch (erro) {
    console.error("❌ Erro ao verificar token:", erro);
    return reply.status(401).send({
      error: "Token inválido ou expirado",
    });
  }
};
