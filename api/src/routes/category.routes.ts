import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers/category.controller";

const categoryRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get("/", getCategories);
};

export default categoryRoutes;
