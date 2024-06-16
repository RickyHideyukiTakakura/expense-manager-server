import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import { SendAuthenticationLinkUseCase } from "@/domain/application/use-cases/send-authentication-link";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { FastifyInstance } from "fastify";
import { RegisterUserController } from "./register-user.controller";
import { SendAuthenticationLinkController } from "./send-authentication-link.controller";

export async function usersRoutes(app: FastifyInstance) {
  const registerUserUseCase = new RegisterUserUseCase(
    new PrismaUsersRepository()
  );
  const sendAuthenticationLinkUseCase = new SendAuthenticationLinkUseCase(
    new PrismaUsersRepository()
  );

  const sendAuthenticationLinkController = new SendAuthenticationLinkController(
    sendAuthenticationLinkUseCase
  );
  const registerUserController = new RegisterUserController(
    registerUserUseCase
  );

  app.post("/users", (request, reply) =>
    registerUserController.handle(request, reply)
  );

  app.post("/authenticate", (request, reply) =>
    sendAuthenticationLinkController.handle(request, reply)
  );
}
