import { DeleteExpenseUseCase } from "@/domain/application/use-cases/delete-expense";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deleteExpenseParamsSchema = z.object({
  id: z.string(),
});

export class DeleteExpenseController {
  constructor(private deleteExpense: DeleteExpenseUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteExpenseParamsSchema.parse(request.params);

    const userId = request.user.sub;

    const result = await this.deleteExpense.execute({
      id,
      userId,
    });

    if (result.isLeft()) {
      throw new Error("Bad request");
    }

    return reply.status(204).send();
  }
}
