import { PaginationParams } from "@/core/repositories/pagination-params";
import { ExpensesRepository } from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";

export class InMemoryExpensesRepository implements ExpensesRepository {
  public items: Expense[] = [];

  async findTotalItems() {
    const totalItems = this.items.length;

    return totalItems;
  }

  async findMany({ pageIndex }: PaginationParams) {
    const expenses = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((pageIndex - 1) * 10, pageIndex * 10);

    return expenses;
  }

  async findById(id: string) {
    const expense = this.items.find((item) => item.id.toString() === id);

    if (!expense) {
      return null;
    }

    return expense;
  }

  async create(expense: Expense) {
    this.items.push(expense);
  }

  async delete(expense: Expense) {
    const itemIndex = this.items.findIndex((item) => item.id === expense.id);

    this.items.splice(itemIndex, 1);
  }
}
