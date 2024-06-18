import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import { routes } from "./http/controllers/routes";

export const app = fastify();

app.register(fastifyJwt, { secret: env.JWT_SECRET_KEY });

app.register(fastifyCookie);

app.register(routes);

// app.setErrorHandler((error, _request, reply) => {
//   if (error instanceof ZodError) {
//     return reply.status(400).send({
//       message: 'Validation error.',
//       issues: error.format(),
//     })
//   }

//   if (env.NODE_ENV !== 'production') {
//     console.error(error)
//   } else {
//     // TODO: ...
//   }

//   return reply.status(500).send({ message: 'Internal Server Error.' })
// })
