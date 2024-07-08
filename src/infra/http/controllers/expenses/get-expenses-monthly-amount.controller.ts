import { GetExpensesMonthlyAmountUseCase } from "@/domain/application/use-cases/get-expenses-monthly-amount";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetExpensesMonthlyAmountController {
  constructor(
    private getExpensesMonthlyAmount: GetExpensesMonthlyAmountUseCase
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getExpensesMonthlyAmount.execute();

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    const currentMonthlyExpenseAmount =
      result.value.currentMonthlyExpenseAmount;
    const diffFromLastMonth = result.value.diffFromLastMonth.toFixed(2);

    return reply.status(200).send({
      currentMonthlyExpenseAmount,
      diffFromLastMonth,
    });
  }
}
