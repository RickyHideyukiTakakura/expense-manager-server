import { PaginationParams } from "@/core/repositories/pagination-params";
import { Expense } from "@/domain/enterprise/entities/expense";

export interface ExpensesRepository {
  findTotalItems(): Promise<number>;
  findMany(params: PaginationParams): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  create(expense: Expense): Promise<void>;
  delete(expense: Expense): Promise<void>;
}
