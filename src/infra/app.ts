import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { routes } from "./http/controllers/routes";

export const app = fastify();

const allowedOrigins = [env.AUTH_REDIRECT_URL];

app.register(fastifyCors, {
  origin: true,
  credentials: true,
  allowedHeaders: ["content-type"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
  cookie: { cookieName: "accessToken", signed: false },
});

app.register(fastifyCookie);

app.register(routes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: ...
  }

  return reply.status(500).send({ message: "Internal Server Error." });
});
