import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Send auth link E2E", () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import("@/infra/app")).app;

    prisma = new PrismaClient();
    userFactory = new UserFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to send an auth link to authenticate user", async () => {
    await userFactory.makePrismaUser({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const response = await request(app.server).post("/authenticate").send({
      email: "johndoe@example.com",
    });

    expect(response.statusCode).toEqual(200);
  });
});
