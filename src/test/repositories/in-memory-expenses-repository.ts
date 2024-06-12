import { PaginationParams } from "@/core/repositories/pagination-params";
import { ExpensesRepository } from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";

export class InMemoryExpensesRepository implements ExpensesRepository {
  public items: Expense[] = [];

  async findMany({ pageIndex }: PaginationParams) {
    const expenses = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((pageIndex - 1) * 10, pageIndex * 10);

    return expenses;
  }

  async create(expense: Expense) {
    this.items.push(expense);
  }
}
