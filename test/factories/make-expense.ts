import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense, ExpenseProps } from "@/domain/enterprise/entities/expense";
import { PrismaExpenseMapper } from "@/infra/database/prisma/mappers/prisma-expense-mapper";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export function makeExpense(
  override: Partial<ExpenseProps> = {},
  id?: UniqueEntityID
) {
  const expense = Expense.create(
    {
      userId: new UniqueEntityID(),
      description: faker.lorem.word(),
      category: faker.lorem.sentence(),
      payment: faker.lorem.sentence(),
      price: faker.number.float({ fractionDigits: 2 }),
      ...override,
    },
    id
  );

  return expense;
}

export class ExpenseFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaExpense(data: Partial<ExpenseProps> = {}): Promise<Expense> {
    const expense = makeExpense(data);

    await this.prisma.expense.create({
      data: PrismaExpenseMapper.toPrisma(expense),
    });

    return expense;
  }
}
