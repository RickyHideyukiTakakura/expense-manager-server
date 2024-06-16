import { FastifyInstance } from "fastify";
import request from "supertest";
import { beforeAll } from "vitest";

describe("Register user E2E", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = (await import("@/infra/app")).app;

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register a new user", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(response.statusCode).toEqual(201);
  });
});
