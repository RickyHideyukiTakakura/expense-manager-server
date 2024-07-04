import { GetExpensesTotalAmountUseCase } from "@/domain/application/use-cases/get-expenses-total-amount";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetExpensesTotalAmountController {
  constructor(private getExpensesTotalAmount: GetExpensesTotalAmountUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getExpensesTotalAmount.execute();

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    const totalAmount = result.value.totalAmount;

    return reply.status(200).send({
      totalAmount,
    });
  }
}
