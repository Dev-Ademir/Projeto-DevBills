import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("🆗 Conexão com o BD estabelecida com sucesso");
  } catch (error) {
    console.error("❌ Falha ao conectar ao BD");
    throw error;
  }
};

export default prisma;
