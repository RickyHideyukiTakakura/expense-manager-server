import { CreateExpenseUseCase } from "@/domain/application/use-cases/create-expense";
import { GetExpensesUseCase } from "@/domain/application/use-cases/get-expenses";
import { PrismaExpensesRepository } from "@/infra/database/prisma/repositories/prisma-expenses-repository";
import { verifyJWT } from "@/infra/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { CreateExpenseController } from "./create-expense.controller";
import { GetExpensesController } from "./get-expenses.controller";

export async function expensesRoutes(app: FastifyInstance) {
  const createExpenseUseCase = new CreateExpenseUseCase(
    new PrismaExpensesRepository()
  );
  const getExpensesUseCase = new GetExpensesUseCase(
    new PrismaExpensesRepository()
  );

  const createExpenseController = new CreateExpenseController(
    createExpenseUseCase
  );
  const getExpensesController = new GetExpensesController(getExpensesUseCase);

  app.post("/expenses", { onRequest: verifyJWT }, (request, reply) =>
    createExpenseController.handle(request, reply)
  );
  app.get("/expenses", { onRequest: verifyJWT }, (request, reply) =>
    getExpensesController.handle(request, reply)
  );
}
