import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense, ExpenseProps } from "@/domain/enterprise/entities/expense";
import { faker } from "@faker-js/faker";

export function makeExpense(
  override: Partial<ExpenseProps> = {},
  id?: UniqueEntityID
) {
  const expense = Expense.create(
    {
      userId: new UniqueEntityID(),
      description: faker.lorem.word(),
      category: faker.lorem.sentence(),
      method: faker.lorem.sentence(),
      price: faker.number.float({ fractionDigits: 2 }),
      ...override,
    },
    id
  );

  return expense;
}
