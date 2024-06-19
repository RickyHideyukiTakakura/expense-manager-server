import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { routes } from "./http/controllers/routes";

export const app = fastify();

const isTestEnv = env.NODE_ENV === "test";

app.register(fastifyCors, {
  credentials: true,
  allowedHeaders: ["content-type"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  origin: (origin, cb) => {
    if (isTestEnv) {
      cb(null, true);
      return;
    }

    if (!origin) {
      cb(new Error("Not allowed"), false);
      return;
    }

    cb(null, true);
  },
});

app.register(fastifyJwt, { secret: env.JWT_SECRET_KEY });

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
