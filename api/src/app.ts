import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import routes from "./routes/index";

const app: FastifyInstance = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
});
app.register(routes, { prefix: "/api" });

export default app;
