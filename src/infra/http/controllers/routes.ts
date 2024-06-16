import { FastifyInstance } from "fastify";
import { usersRoutes } from "./users/users.routes";

export async function routes(app: FastifyInstance) {
  await usersRoutes(app);
}
