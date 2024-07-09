import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Get popular categories E2E", () => {
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

  it("should be able to get popular categories", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    await Promise.all([
      expenseFactory.makePrismaExpense({
        userId: user.id,
        category: "Category 1",
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        category: "Category 1",
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        category: "Category 2",
      }),
    ]);

    const response = await request(app.server)
      .get("/expenses/popular-categories")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        { category: "Category 1", amount: 2 },
        { category: "Category 2", amount: 1 },
      ]),
    });
  });
});
