import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Get expenses monthly amount E2E", () => {
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

  it("should be able to get expenses monthly amount", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    const today = dayjs();
    const lastMonth = today.subtract(1, "months");

    await Promise.all([
      expenseFactory.makePrismaExpense({
        userId: user.id,
        createdAt: today.toDate(),
        price: 10,
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        createdAt: today.toDate(),
        price: 20,
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        createdAt: lastMonth.toDate(),
        price: 15,
      }),
    ]);

    const response = await request(app.server)
      .get("/expenses/monthly-amount")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        currentMonthlyExpenseAmount: 30,
        diffFromLastMonth: "100.00",
      })
    );
  });
});
