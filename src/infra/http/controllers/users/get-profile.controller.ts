import { ResourceNotFoundError } from "@/domain/application/use-cases/errors/resource-not-found-error";
import { GetProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserPresenter } from "../../presenters/user-presenter";

export class GetProfileController {
  constructor(private getProfile: GetProfileUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const id = request.user.sub;

    const result = await this.getProfile.execute({
      id,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({
          message: error.message,
        });
      }

      throw error;
    }

    const user = result.value.user;

    return reply.status(200).send({
      user: UserPresenter.toHTTP(user),
    });
  }
}
