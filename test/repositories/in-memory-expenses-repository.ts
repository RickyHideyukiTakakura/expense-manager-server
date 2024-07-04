import { ExpenseParams } from "@/core/repositories/expense-params";
import { ExpensesRepository } from "@/domain/application/repositories/expenses-repository";
import { Expense } from "@/domain/enterprise/entities/expense";

export class InMemoryExpensesRepository implements ExpensesRepository {
  public items: Expense[] = [];

  async findTotalItems({
    description,
    category,
    payment,
    createdAt,
  }: ExpenseParams) {
    const totalItems = this.items
      .filter((item) =>
        description
          ? item.description.toLowerCase().includes(description.toLowerCase())
          : true
      )
      .filter((item) =>
        category
          ? item.category.toLowerCase().includes(category.toLowerCase())
          : true
      )
      .filter((item) =>
        payment
          ? item.payment.toLowerCase().includes(payment.toLowerCase())
          : true
      )
      .filter((item) =>
        createdAt ? item.createdAt.toISOString() === createdAt : true
      );

    return totalItems.length;
  }

  async findMany({
    pageIndex,
    description,
    category,
    payment,
    createdAt,
  }: ExpenseParams) {
    const expenses = this.items
      .filter((item) =>
        description
          ? item.description.toLowerCase().includes(description.toLowerCase())
          : true
      )
      .filter((item) =>
        category
          ? item.category.toLowerCase().includes(category.toLowerCase())
          : true
      )
      .filter((item) =>
        payment
          ? item.payment.toLowerCase().includes(payment.toLowerCase())
          : true
      )
      .filter((item) =>
        createdAt ? item.createdAt.toISOString() === createdAt : true
      )
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

  async findAll() {
    const expenses = this.items;

    return expenses;
  }

  async save(expense: Expense) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === expense.id.toString()
    );

    this.items[itemIndex] = expense;
  }

  async create(expense: Expense) {
    this.items.push(expense);
  }

  async delete(expense: Expense) {
    const itemIndex = this.items.findIndex((item) => item.id === expense.id);

    this.items.splice(itemIndex, 1);
  }
}
