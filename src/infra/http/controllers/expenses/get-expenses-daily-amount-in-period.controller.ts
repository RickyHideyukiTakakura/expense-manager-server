import { GetExpensesDailyAmountInPeriodUseCase } from "@/domain/application/use-cases/get-expenses-daily-amount-in-period";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const getExpensesDailyAmountInPeriodSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export class GetExpensesDailyAmountInPeriodController {
  constructor(
    private getExpensesDailyAmountInPeriod: GetExpensesDailyAmountInPeriodUseCase
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { from, to } = getExpensesDailyAmountInPeriodSchema.parse(
      request.query
    );

    const result = await this.getExpensesDailyAmountInPeriod.execute({
      from,
      to,
    });

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    return reply.status(200).send({
      expensesAmountInPeriod: result.value.expensesAmountInPeriod,
    });
  }
}
