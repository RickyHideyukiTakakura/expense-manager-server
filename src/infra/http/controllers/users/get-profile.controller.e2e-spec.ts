import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Get profile E2E", () => {
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

  it("should be able to get profile", async () => {
    const user = await userFactory.makePrismaUser({
      email: "johndoe@example.com",
      name: "John Doe",
    });

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    console.log(response);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({
        email: "johndoe@example.com",
        name: "John Doe",
      }),
    });
  });
});
