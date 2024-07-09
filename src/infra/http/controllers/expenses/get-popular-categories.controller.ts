import { GetPopularCategoriesUseCase } from "@/domain/application/use-cases/get-popular-categories";
import { FastifyReply, FastifyRequest } from "fastify";

export class GetPopularCategoriesController {
  constructor(private getPopularCategories: GetPopularCategoriesUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getPopularCategories.execute();

    if (result.isLeft()) {
      throw new Error("Bad Request");
    }

    return reply.status(200).send({
      categories: result.value.categories,
    });
  }
}
