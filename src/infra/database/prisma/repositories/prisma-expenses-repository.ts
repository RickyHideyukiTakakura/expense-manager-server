import { PaginationParams } from "@/core/repositories/pagination-params";
import { ExpensesRepository } from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";
import { prisma } from "@/infra/lib/prisma";
import { PrismaExpenseMapper } from "../mappers/prisma-expense-mapper";

export class PrismaExpensesRepository implements ExpensesRepository {
  async findMany({ pageIndex }: PaginationParams): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (pageIndex - 1) * 20,
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
