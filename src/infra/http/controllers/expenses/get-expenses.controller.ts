import { UserAlreadyExistsError } from "@/domain/application/use-cases/errors/user-already-exists-error";
import { GetExpensesUseCase } from "@/domain/application/use-cases/get-expenses";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const getExpensesBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export class GetExpensesController {
  constructor(private getExpenses: GetExpensesUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = getExpensesBodySchema.parse(request.body);

    const result = await this.getExpenses.execute({
      name,
      email,
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
