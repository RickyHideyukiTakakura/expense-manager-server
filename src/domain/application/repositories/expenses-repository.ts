import { ExpenseParams } from "@/core/repositories/expense-params";
import { PeriodParams } from "@/core/repositories/period-params";
import { Expense } from "@/domain/enterprise/entities/expense";

export interface CategoryProps {
  category: string;
  amount: number;
}

export interface PeriodProps {
  amount: number;
  date: string;
}

export interface ExpensesRepository {
  findByMonthWithYear(monthWithYear: string): Promise<Expense[]>;
  findByDay(day: string): Promise<Expense[]>;
  findTotalItems(params: ExpenseParams): Promise<number>;
  findMany(params: ExpenseParams): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  findByPeriod(params: PeriodParams): Promise<PeriodProps[]>;
  findCategories(): Promise<CategoryProps[]>;
  findAll(): Promise<Expense[]>;
  save(expense: Expense): Promise<void>;
  create(expense: Expense): Promise<void>;
  delete(expense: Expense): Promise<void>;
}
