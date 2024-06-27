import { GetExpensesUseCase } from "@/domain/application/use-cases/get-expenses";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ExpensePresenter } from "../../presenters/expense-presenter";

const getExpensesQuerySchema = z.object({
  description: z.string().optional(),
  category: z.string().optional(),
  payment: z.string().optional(),
  createdAt: z.date().optional(),
  pageIndex: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1)),
});

export class GetExpensesController {
  constructor(private getExpenses: GetExpensesUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { description, category, payment, createdAt, pageIndex } =
      getExpensesQuerySchema.parse(request.query);

    const result = await this.getExpenses.execute({
      pageIndex,
      description,
      category,
      payment,
      createdAt,
    });

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    const expenses = result.value.expenses;
    const totalItems = result.value.totalItems;

    return reply.status(200).send({
      expenses: expenses.map(ExpensePresenter.toHTTP),
      totalItems,
    });
  }
}
