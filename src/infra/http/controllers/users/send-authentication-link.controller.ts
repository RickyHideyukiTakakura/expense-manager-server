import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";
import { SendAuthenticationLinkUseCase } from "@/domain/application/use-cases/send-authentication-link";
import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const sendAuthenticationLinkBodySchema = z.object({
  email: z.string().email(),
});

export class SendAuthenticationLinkController {
  constructor(private sendAuthenticationLink: SendAuthenticationLinkUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email } = sendAuthenticationLinkBodySchema.parse(request.body);

    const result = await this.sendAuthenticationLink.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof WrongCredentialsError) {
        return reply.status(401).send({
          message: error.message,
        });
      }

      throw error;
    }

    const { authLinkCode } = result.value;

    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    console.log(authLink.toString());

    return reply.status(200).send();
  }
}
