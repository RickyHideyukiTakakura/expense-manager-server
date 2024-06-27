import { ExpenseParams } from "@/core/repositories/expense-params";
import { Expense } from "@/domain/enterprise/entities/expense";

export interface ExpensesRepository {
  findTotalItems(params: ExpenseParams): Promise<number>;
  findMany(params: ExpenseParams): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  create(expense: Expense): Promise<void>;
  delete(expense: Expense): Promise<void>;
}
