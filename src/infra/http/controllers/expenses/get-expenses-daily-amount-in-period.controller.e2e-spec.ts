import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Get daily amount in period E2E", () => {
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

  it("should be able to get daily expenses amount in period", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 16);

    await Promise.all([
      expenseFactory.makePrismaExpense({
        userId: user.id,
        price: 10,
        createdAt: startDate,
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        price: 10,
        createdAt: startDate,
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        price: 10,
        createdAt: endDate,
      }),
    ]);

    const response = await request(app.server)
      .get("/expenses/daily-amount-period")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      });

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      expensesAmountInPeriod: expect.arrayContaining([
        { amount: 20, date: startDate.toISOString() },
        { amount: 10, date: endDate.toISOString() },
      ]),
    });
  });
});
