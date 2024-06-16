import { UserAlreadyExistsError } from "@/domain/application/use-cases/errors/user-already-exists-error";
import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = registerUserBodySchema.parse(request.body);

    const result = await this.registerUser.execute({
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
