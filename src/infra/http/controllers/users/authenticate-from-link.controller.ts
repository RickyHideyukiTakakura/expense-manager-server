import { AuthenticateFromLinkUseCase } from "@/domain/application/use-cases/authenticate-from-link";
import { AuthLinkCodeNotFoundError } from "@/domain/application/use-cases/errors/auth-link-code-not-found";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const authenticateFromLinkQuerySchema = z.object({
  code: z.string(),
  redirect: z.string(),
});

export class AuthenticateFromLinkController {
  constructor(private authenticateFromLink: AuthenticateFromLinkUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { code, redirect } = authenticateFromLinkQuerySchema.parse(
      request.query
    );

    const result = await this.authenticateFromLink.execute({
      code,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof AuthLinkCodeNotFoundError) {
        return reply.status(404).send({
          message: error.message,
        });
      }

      throw error;
    }

    const { accessToken } = result.value;

    reply.setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 86400,
      path: "/",
    });

    return reply.status(200).redirect(redirect);
  }
}
