import { CreateExpenseUseCase } from "@/domain/application/use-cases/create-expense";
import { DeleteExpenseUseCase } from "@/domain/application/use-cases/delete-expense";
import { GetExpensesUseCase } from "@/domain/application/use-cases/get-expenses";
import { PrismaExpensesRepository } from "@/infra/database/prisma/repositories/prisma-expenses-repository";
import { verifyJWT } from "@/infra/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { CreateExpenseController } from "./create-expense.controller";
import { DeleteExpenseController } from "./delete-expense.controller";
import { GetExpensesController } from "./get-expenses.controller";

export async function expensesRoutes(app: FastifyInstance) {
  const createExpenseUseCase = new CreateExpenseUseCase(
    new PrismaExpensesRepository()
  );
  const getExpensesUseCase = new GetExpensesUseCase(
    new PrismaExpensesRepository()
  );
  const deleteExpenseUseCase = new DeleteExpenseUseCase(
    new PrismaExpensesRepository()
  );

  const createExpenseController = new CreateExpenseController(
    createExpenseUseCase
  );
  const getExpensesController = new GetExpensesController(getExpensesUseCase);
  const deleteExpensesController = new DeleteExpenseController(
    deleteExpenseUseCase
  );

  app.post("/expenses", { onRequest: verifyJWT }, (request, reply) =>
    createExpenseController.handle(request, reply)
  );
  app.get("/expenses", { onRequest: verifyJWT }, (request, reply) =>
    getExpensesController.handle(request, reply)
  );
  app.delete("/expenses/:id", { onRequest: verifyJWT }, (request, reply) =>
    deleteExpensesController.handle(request, reply)
  );
}
