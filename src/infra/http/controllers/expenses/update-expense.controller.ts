import { UpdateExpenseUseCase } from "@/domain/application/use-cases/update-expense";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateExpenseBodySchema = z.object({
  description: z.string().optional(),
  category: z.string().optional(),
  payment: z.string().optional(),
  price: z.number().optional(),
  createdAt: z.coerce.date().optional(),
});

const updateExpenseParamsSchema = z.object({
  id: z.string(),
});

export class UpdateExpenseController {
  constructor(private updateExpense: UpdateExpenseUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { description, category, payment, price, createdAt } =
      updateExpenseBodySchema.parse(request.body);

    const { id } = updateExpenseParamsSchema.parse(request.params);

    const userId = request.user.sub;

    const result = await this.updateExpense.execute({
      id,
      userId,
      description,
      category,
      payment,
      price,
      createdAt,
    });

    if (result.isLeft()) {
      throw new Error("Bad request");
    }

    return reply.status(200).send();
  }
}
