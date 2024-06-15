import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { FastifyInstance } from "fastify";
import { RegisterUserController } from "./register-user.controller";

export async function routes(app: FastifyInstance) {
  const registerUserUseCase = new RegisterUserUseCase(
    new PrismaUsersRepository()
  );
  const registerUserController = new RegisterUserController(
    registerUserUseCase
  );

  app.post("/users", (request, reply) =>
    registerUserController.handle(request, reply)
  );
}
