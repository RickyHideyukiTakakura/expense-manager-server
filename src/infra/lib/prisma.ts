import { PrismaClient } from "@prisma/client";
import { envSchema } from "../env";

const env = envSchema.parse(process.env);

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
