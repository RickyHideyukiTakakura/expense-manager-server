import { CreateExpenseUseCase } from "@/domain/application/use-cases/create-expense";
import { DeleteExpenseUseCase } from "@/domain/application/use-cases/delete-expense";
import { GetExpensesUseCase } from "@/domain/application/use-cases/get-expenses";
import { GetExpensesDailyAmountUseCase } from "@/domain/application/use-cases/get-expenses-daily-amount";
import { GetExpensesMonthlyAmountUseCase } from "@/domain/application/use-cases/get-expenses-monthly-amount";
import { GetExpensesTotalAmountUseCase } from "@/domain/application/use-cases/get-expenses-total-amount";
import { GetPopularCategoriesUseCase } from "@/domain/application/use-cases/get-popular-categories";
import { UpdateExpenseUseCase } from "@/domain/application/use-cases/update-expense";
import { PrismaExpensesRepository } from "@/infra/database/prisma/repositories/prisma-expenses-repository";
import { verifyJWT } from "@/infra/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { CreateExpenseController } from "./create-expense.controller";
import { DeleteExpenseController } from "./delete-expense.controller";
import { GetExpensesDailyAmountController } from "./get-expenses-daily-amount.controller";
import { GetExpensesMonthlyAmountController } from "./get-expenses-monthly-amount.controller";
import { GetExpensesTotalAmountController } from "./get-expenses-total-amount.controller";
import { GetExpensesController } from "./get-expenses.controller";
import { GetPopularCategoriesController } from "./get-popular-categories.controller";
import { UpdateExpenseController } from "./update-expense.controller";

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

  const updateExpenseUseCase = new UpdateExpenseUseCase(
    new PrismaExpensesRepository()
  );

  const getExpensesTotalAmountUseCase = new GetExpensesTotalAmountUseCase(
    new PrismaExpensesRepository()
  );

  const getExpensesMonthlyAmountUseCase = new GetExpensesMonthlyAmountUseCase(
    new PrismaExpensesRepository()
  );

  const getExpensesDailyAmountUseCase = new GetExpensesDailyAmountUseCase(
    new PrismaExpensesRepository()
  );
  const getPopularCategoriesUseCase = new GetPopularCategoriesUseCase(
    new PrismaExpensesRepository()
  );

  const createExpenseController = new CreateExpenseController(
    createExpenseUseCase
  );
  const getExpensesController = new GetExpensesController(getExpensesUseCase);
  const deleteExpensesController = new DeleteExpenseController(
    deleteExpenseUseCase
  );
  const updateExpenseController = new UpdateExpenseController(
    updateExpenseUseCase
  );
  const getExpensesTotalAmountController = new GetExpensesTotalAmountController(
    getExpensesTotalAmountUseCase
  );
  const getExpensesMonthlyAmountController =
    new GetExpensesMonthlyAmountController(getExpensesMonthlyAmountUseCase);

  const getExpensesDailyAmountController = new GetExpensesDailyAmountController(
    getExpensesDailyAmountUseCase
  );
  const getPopularCategoriesController = new GetPopularCategoriesController(
    getPopularCategoriesUseCase
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
  app.put("/expenses/:id", { onRequest: verifyJWT }, (request, reply) =>
    updateExpenseController.handle(request, reply)
  );
  app.get(
    "/expenses/total-amount",
    { onRequest: verifyJWT },
    (request, reply) => getExpensesTotalAmountController.handle(request, reply)
  );
  app.get(
    "/expenses/monthly-amount",
    { onRequest: verifyJWT },
    (request, reply) =>
      getExpensesMonthlyAmountController.handle(request, reply)
  );
  app.get(
    "/expenses/daily-amount",
    { onRequest: verifyJWT },
    (request, reply) => getExpensesDailyAmountController.handle(request, reply)
  );
  app.get(
    "/expenses/popular-categories",
    { onRequest: verifyJWT },
    (request, reply) => getPopularCategoriesController.handle(request, reply)
  );
}
