import { env } from "../src/config/env.js";
import { prismaConnect } from "../src/config/prisma.js";
import { initializeGlobalCategories } from "../src/services/globalCategories.service.js";
import app from "./app.js";
import initializeFirebaseAdmin from "./config/firebase.js";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();
    await initializeGlobalCategories();

    await app.listen({ port: PORT }).then(() => {
      console.log(`servidor rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("❌erro ao iniciar o servidor:", erro);
    process.exit(1);
  }
};

startServer();
