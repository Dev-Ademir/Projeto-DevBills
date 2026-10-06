import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/controller/createTransaction.controller.js";
import { deleteTransaction } from "../controllers/controller/deleteTransaction.controller.js";
import { getTransactions } from "../controllers/controller/getTransaction.controller.js";
import { getTransactionHistorical } from "../controllers/controller/getTransactionHistorical.controller.js";
import { getTransactionSummary } from "../controllers/controller/getTransactionSummary.controller.js";
import { authMiddleware } from "./../middlewares/auth.middlewares";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionHistoricalSchema,
  getTransactionSummarySchema,
  getTransactionsSchema,
} from "../schema/transaction.schema.js";

const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.addHook("preHandler", authMiddleware);
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: createTransactionSchema,
    },
    handler: createTransaction,
  });

  // Buscar com filtros
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: getTransactionsSchema,
    },
    handler: getTransactions,
  });

  // Buscar resumo de transações
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: getTransactionSummarySchema,
    },
    handler: getTransactionSummary,
  });

  // Histórico de transações
  fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
      querystring: getTransactionHistoricalSchema,
    },
    handler: getTransactionHistorical,
  });

  //Deletar transação
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: deleteTransactionSchema,
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
