import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense } from "@/domain/enterprise/entities/expense";
import { Prisma, Expense as PrismaExpense } from "@prisma/client";

export class PrismaExpenseMapper {
  static toDomain(raw: PrismaExpense): Expense {
    return Expense.create(
      {
        userId: new UniqueEntityID(raw.userId),
        description: raw.description,
        category: raw.category,
        payment: raw.payment,
        price: Number(raw.price),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(expense: Expense): Prisma.ExpenseUncheckedCreateInput {
    const prismaExpense = {
      id: expense.id.toString(),
      userId: expense.userId.toString(),
      description: expense.description,
      category: expense.category,
      payment: expense.payment,
      price: expense.price,
      createdAt: expense.createdAt,
    };

    return prismaExpense;
  }
}
