// src/middlewares/auth.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "firebase-admin/auth";

// Interface para o usuário autenticado
export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    uid: string;
    email: string;
    name?: string;
  };
}

// Interface para o erro do Firebase (mais específica)
interface FirebaseError extends Error {
  code?: string;
  message: string;
}

export async function authMiddleware(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    console.log("🔍 ===== INICIANDO VERIFICAÇÃO =====");

    const authHeader = request.headers.authorization;
    console.log("📋 Header:", authHeader);

    if (!authHeader) {
      console.log("❌ Header não encontrado");
      return reply.status(401).send({
        error: "Token não fornecido",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Formato inválido");
      return reply.status(401).send({
        error: "Formato inválido. Use: Bearer <token>",
      });
    }

    // ✅ 1. CORRIGIDO: Verifica se o token existe e é string
    const token = authHeader.split(" ")[1];

    // Verificação explícita para garantir que token existe
    if (!token) {
      console.log("❌ Token vazio");
      return reply.status(401).send({
        error: "Token não fornecido",
      });
    }

    console.log("📋 Token (primeiros 30 chars):", token.substring(0, 30) + "...");

    try {
      console.log("🔄 Verificando com Firebase...");

      // ✅ 2. CORRIGIDO: token é garantidamente string aqui
      const decoded = await getAuth().verifyIdToken(token);

      console.log("✅ Token válido! Usuário:", decoded.email);

      request.user = {
        uid: decoded.uid,
        email: decoded.email || "",
        name: decoded.name || "",
      };

      // Se chegou aqui, o token é válido
      console.log("✅ Autenticação concluída com sucesso");
    } catch (error) {
      // ✅ 3. CORRIGIDO: Usa tipo desconhecido e faz casting seguro
      console.error("❌ Firebase error:", error);

      // Faz o cast para a interface criada
      const firebaseError = error as FirebaseError;

      // Mensagens mais específicas
      if (firebaseError.code === "auth/id-token-expired") {
        return reply.status(401).send({
          error: "Token expirado. Faça login novamente.",
        });
      }
      if (firebaseError.code === "auth/argument-error") {
        return reply.status(401).send({
          error: "Token mal formatado. Verifique se copiou corretamente.",
        });
      }
      if (firebaseError.code === "auth/user-not-found") {
        return reply.status(401).send({
          error: "Usuário não encontrado no Firebase.",
        });
      }

      return reply.status(401).send({
        error: "Token inválido",
        code: firebaseError.code || "unknown",
        message: firebaseError.message || "Erro ao verificar token",
      });
    }
  } catch (error) {
    console.error("❌ Erro no middleware:", error);
    return reply.status(500).send({
      error: "Erro interno ao verificar autenticação",
    });
  }
}
