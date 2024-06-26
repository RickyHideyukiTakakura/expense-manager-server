import { AuthenticateFromLinkUseCase } from "@/domain/application/use-cases/authenticate-from-link";
import { GetProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import { SendAuthenticationLinkUseCase } from "@/domain/application/use-cases/send-authentication-link";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { PrismaAuthLinksRepository } from "@/infra/database/prisma/repositories/prisma-auth-links-repository";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { verifyJWT } from "@/infra/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { AuthenticateFromLinkController } from "./authenticate-from-link.controller";
import { GetProfileController } from "./get-profile.controller";
import { RegisterUserController } from "./register-user.controller";
import { SendAuthenticationLinkController } from "./send-authentication-link.controller";

export async function usersRoutes(app: FastifyInstance) {
  const registerUserUseCase = new RegisterUserUseCase(
    new PrismaUsersRepository()
  );
  const sendAuthenticationLinkUseCase = new SendAuthenticationLinkUseCase(
    new PrismaUsersRepository(),
    new PrismaAuthLinksRepository()
  );
  const authenticateFromLinkUseCase = new AuthenticateFromLinkUseCase(
    new PrismaAuthLinksRepository(),
    new JwtEncrypter(app)
  );
  const getProfileUseCase = new GetProfileUseCase(new PrismaUsersRepository());

  const sendAuthenticationLinkController = new SendAuthenticationLinkController(
    sendAuthenticationLinkUseCase
  );
  const registerUserController = new RegisterUserController(
    registerUserUseCase
  );
  const authenticateFromLinkController = new AuthenticateFromLinkController(
    authenticateFromLinkUseCase
  );
  const getProfileController = new GetProfileController(getProfileUseCase);

  app.post("/users", (request, reply) =>
    registerUserController.handle(request, reply)
  );
  app.post("/authenticate", (request, reply) =>
    sendAuthenticationLinkController.handle(request, reply)
  );
  app.get("/auth-links/authenticate", (request, reply) =>
    authenticateFromLinkController.handle(request, reply)
  );
  app.post("/sign-out", (_, reply) => {
    reply.clearCookie("accessToken");
    return reply.status(200).send();
  });
  app.get("/me", { onRequest: verifyJWT }, (request, reply) =>
    getProfileController.handle(request, reply)
  );
}
