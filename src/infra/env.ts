import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET_KEY: z.string(),
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().optional().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  PORT: z.coerce.number().optional().default(3333),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
