import { GetExpensesDailyAmountUseCase } from "@/domain/application/use-cases/get-expenses-daily-amount";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetExpensesDailyAmountController {
  constructor(private getExpensesDailyAmount: GetExpensesDailyAmountUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getExpensesDailyAmount.execute();

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    const dailyExpenseAmount = result.value.dailyExpenseAmount;
    const diffFromYesterday = result.value.diffFromYesterday.toFixed(2);

    return reply.status(200).send({
      dailyExpenseAmount,
      diffFromYesterday,
    });
  }
}
