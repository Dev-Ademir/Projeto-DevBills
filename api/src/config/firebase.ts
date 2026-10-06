import { cert, getApps, initializeApp } from "firebase-admin/app";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  if (getApps().length > 0) return;

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

  if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error("❌Falha ao carregar credenciais do firebase.");
  }

  try {
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
  } catch (erro) {
    console.error(erro, "❌Falha ao conectar no firebase");
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;
