import { CreateExpenseUseCase } from "@/domain/application/use-cases/create-expense";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createExpenseBodySchema = z.object({
  description: z.string(),
  category: z.string(),
  payment: z.string(),
  price: z.number(),
});

export class CreateExpenseController {
  constructor(private createExpense: CreateExpenseUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { description, category, payment, price } =
      createExpenseBodySchema.parse(request.body);

    const userId = request.user.sub;

    const result = await this.createExpense.execute({
      userId,
      description,
      category,
      payment,
      price,
    });

    if (result.isLeft()) {
      throw new Error("Bad request");
    }

    return reply.status(201).send();
  }
}
