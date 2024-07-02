import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { ExpenseFactory } from "test/factories/make-expense";
import { UserFactory } from "test/factories/make-user";

describe("Update expense E2E", () => {
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

  it("should be able to update an expense", async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = app.jwt.sign({
      sub: user.id.toString(),
    });

    const expense = await expenseFactory.makePrismaExpense({
      userId: user.id,
    });

    const response = await request(app.server)
      .put(`/expenses/${expense.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: "Update expense description",
      });

    const expenseOnDatabase = await prisma.expense.findUnique({
      where: {
        id: expense.id.toString(),
      },
    });

    expect(expenseOnDatabase?.description).toEqual(
      "Update expense description"
    );
    expect(response.statusCode).toEqual(200);
  });
});
