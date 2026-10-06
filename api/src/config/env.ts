import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000").transform(Number),
  DATABASE_URL: z
    .string()
    .min(5, "A variável de ambiente DATABASE_URL deve ter pelo menos 5 caracteres e é obrigatória"),
  NODE_ENV: z.enum(["dev", "prod", "test"], {
    message: "A variável de ambiente NODE_ENV deve ser 'dev', 'prod' ou 'test' e é obrigatória",
  }),

  //FIREBASE config
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  process.exit(1);
}

export const env = _env.data;
