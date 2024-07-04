import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Get expenses total amount E2E", () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let userFactory: UserFactory;
  let expenseFactory: ExpenseFactory;

  beforeAll(async () => {
    app = (await import("@/infra/app")).app;

    prisma = new PrismaClient();
    userFactory = new UserFactory(prisma);
    expenseFactory = new ExpenseFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get expenses total amount", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    await Promise.all([
      expenseFactory.makePrismaExpense({
        userId: user.id,
        price: 10,
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        price: 20.8,
      }),
    ]);

    const response = await request(app.server)
      .get("/expenses/total-amount")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      totalAmount: 30.8,
    });
  });
});
