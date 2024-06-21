import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Create expense E2E", () => {
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

  it("should be able to create an expense", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    const response = await request(app.server)
      .post("/expenses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Description test",
        category: "Category test",
        payment: "Payment test",
        price: 10,
      });

    const expenseOnDatabase = await prisma.expense.findFirst({
      where: { description: "Description test" },
    });

    expect(response.statusCode).toEqual(201);
    expect(expenseOnDatabase).toBeTruthy();
  });
});
