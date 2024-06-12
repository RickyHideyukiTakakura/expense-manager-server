import { PaginationParams } from "@/core/repositories/pagination-params";
import { Expense } from "@/domain/enterprise/entities/expense";

export interface ExpensesRepository {
  findMany(params: PaginationParams): Promise<Expense[]>;
  create(expense: Expense): Promise<void>;
}
