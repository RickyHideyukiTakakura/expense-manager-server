import { FastifyInstance } from "fastify";
import { usersRoutes } from "./users/_users.routes";
import { expensesRoutes } from "./expenses/_expenses.routes";

export async function routes(app: FastifyInstance) {
  await usersRoutes(app);
  await expensesRoutes(app);
}
