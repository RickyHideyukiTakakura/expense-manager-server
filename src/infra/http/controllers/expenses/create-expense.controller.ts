import { CreateExpenseUseCase } from "@/domain/application/use-cases/create-expense";
import { UserAlreadyExistsError } from "@/domain/application/use-cases/errors/user-already-exists-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createExpenseBodySchema = z.object({
  description: z.string(),
  category: z.string(),
  method: z.string(),
  price: z.number(),
});

export class CreateExpenseController {
  constructor(private createExpense: CreateExpenseUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { description, category, method, price } =
      createExpenseBodySchema.parse(request.body);

    const result = await this.createExpense.execute({
      userId:,
      description,
      category,
      method,
      price,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
        });
      }

      throw error;
    }

    return reply.status(201).send();
  }
}
