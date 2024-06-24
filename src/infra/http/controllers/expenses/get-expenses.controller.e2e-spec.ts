import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Get expenses E2E", () => {
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

  it("should be able to get expenses", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    await Promise.all([
      expenseFactory.makePrismaExpense({
        userId: user.id,
        description: "Description 01",
        createdAt: new Date(2024, 2, 10),
      }),
      expenseFactory.makePrismaExpense({
        userId: user.id,
        description: "Description 02",
        createdAt: new Date(2024, 2, 20),
      }),
    ]);

    const response = await request(app.server)
      .get("/expenses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      expenses: expect.arrayContaining([
        expect.objectContaining({
          description: "Description 02",
          createdAt: new Date(2024, 2, 20).toISOString(),
        }),
        expect.objectContaining({
          description: "Description 01",
          createdAt: new Date(2024, 2, 10).toISOString(),
        }),
      ]),
    });
  });
});
