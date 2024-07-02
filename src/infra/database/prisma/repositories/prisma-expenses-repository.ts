import { ExpenseParams } from "@/core/repositories/expense-params";
import { ExpensesRepository } from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";
import { prisma } from "@/infra/lib/prisma";
import { PrismaExpenseMapper } from "../mappers/prisma-expense-mapper";

export class PrismaExpensesRepository implements ExpensesRepository {
  async findTotalItems({
    description,
    category,
    payment,
    createdAt,
  }: ExpenseParams): Promise<number> {
    const totalItems = await prisma.expense.count({
      where: {
        description: description
          ? { contains: description, mode: "insensitive" }
          : undefined,
        category: category
          ? { contains: category, mode: "insensitive" }
          : undefined,
        payment: payment
          ? { contains: payment, mode: "insensitive" }
          : undefined,
        createdAt: createdAt ? createdAt : undefined,
      },
    });

    return totalItems;
  }

  async findMany({
    pageIndex,
    description,
    category,
    payment,
    createdAt,
  }: ExpenseParams): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany({
      where: {
        description: description
          ? { contains: description, mode: "insensitive" }
          : undefined,
        category: category
          ? { contains: category, mode: "insensitive" }
          : undefined,
        payment: payment
          ? { contains: payment, mode: "insensitive" }
          : undefined,
        createdAt: createdAt ? createdAt : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (pageIndex - 1) * 10,
    });

    return expenses.map(PrismaExpenseMapper.toDomain);
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
      },
    });

    if (!expense) {
      return null;
    }

    return PrismaExpenseMapper.toDomain(expense);
  }

  async save(expense: Expense): Promise<void> {
    const data = PrismaExpenseMapper.toPrisma(expense);

    await prisma.expense.update({
      where: {
        id: expense.id.toString(),
      },
      data,
    });
  }

  async create(expense: Expense): Promise<void> {
    const data = PrismaExpenseMapper.toPrisma(expense);

    await prisma.expense.create({
      data,
    });
  }

  async delete(expense: Expense): Promise<void> {
    await prisma.expense.delete({
      where: {
        id: expense.id.toString(),
      },
    });
  }
}
