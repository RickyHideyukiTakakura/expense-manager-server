import { ExpenseParams } from "@/core/repositories/expense-params";
import { PeriodParams } from "@/core/repositories/period-params";
import {
  CategoryProps,
  ExpensesRepository,
  PeriodProps,
} from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";
import { prisma } from "@/infra/lib/prisma";
import dayjs from "dayjs";
import { PrismaExpenseMapper } from "../mappers/prisma-expense-mapper";

export class PrismaExpensesRepository implements ExpensesRepository {
  async findByMonthWithYear(monthWithYear: string): Promise<Expense[]> {
    const startOfMonth = dayjs(monthWithYear).startOf("month").toDate();
    const endOfMonth = dayjs(monthWithYear).endOf("month").toDate();

    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return expenses.map(PrismaExpenseMapper.toDomain);
  }

  async findByDay(day: string): Promise<Expense[]> {
    const startOfDay = dayjs(day).startOf("days").toDate();
    const endOfDay = dayjs(day).endOf("days").toDate();

    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return expenses.map(PrismaExpenseMapper.toDomain);
  }

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

  async findByPeriod({ from, to }: PeriodParams): Promise<PeriodProps[]> {
    const startDate = dayjs(from).startOf("day").toDate();
    const endDate = dayjs(to).endOf("day").toDate();

    const dailyExpenses = await prisma.expense.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        price: true,
      },
    });

    return dailyExpenses.map((item) => ({
      date: dayjs(item.createdAt).startOf("day").toISOString(),
      amount: Number(item._sum.price) || 0,
    }));
  }

  async findCategories(): Promise<CategoryProps[]> {
    const categories = await prisma.expense.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    return categories.map((item) => ({
      category: item.category,
      amount: item._count.category,
    }));
  }

  async findAll(): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany();

    return expenses.map(PrismaExpenseMapper.toDomain);
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
