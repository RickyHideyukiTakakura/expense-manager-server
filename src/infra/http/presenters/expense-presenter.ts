import { Expense } from "@/domain/enterprise/entities/expense";

export class ExpensePresenter {
  static toHTTP(expense: Expense) {
    return {
      id: expense.id.toString(),
      userId: expense.userId.toString(),
      description: expense.description,
      category: expense.category,
      payment: expense.payment,
      price: expense.price,
      createdAt: expense.createdAt,
    };
  }
}
