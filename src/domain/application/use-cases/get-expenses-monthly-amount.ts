import { Either, right } from "@/core/either";
import dayjs from "dayjs";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesMonthlyAmountUseCaseRequest {}

export type GetExpensesMonthlyAmountUseCaseResponse = Either<
  null,
  {
    currentMonthlyExpenseAmount: number;
    diffFromLastMonth: number;
  }
>;

export class GetExpensesMonthlyAmountUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute(): Promise<GetExpensesMonthlyAmountUseCaseResponse> {
    const today = dayjs();
    const lastMonth = today.subtract(1, "month");

    const currentMonthWithYear = today.format("YYYY-MM");
    const lastMonthWithYear = lastMonth.format("YYYY-MM");

    const currentMonthExpenses =
      await this.expensesRepository.findByMonthWithYear(currentMonthWithYear);

    const lastMonthExpenses = await this.expensesRepository.findByMonthWithYear(
      lastMonthWithYear
    );

    const currentMonthlyExpenseAmount = currentMonthExpenses?.reduce(
      (total, expense) => total + expense.price,
      0
    );

    const lastMonthlyExpenseAmount = lastMonthExpenses?.reduce(
      (total, expense) => total + expense.price,
      0
    );

    const diffFromLastMonth =
      currentMonthlyExpenseAmount && lastMonthlyExpenseAmount
        ? ((currentMonthlyExpenseAmount - lastMonthlyExpenseAmount) /
            lastMonthlyExpenseAmount) *
          100
        : 0;

    return right({
      currentMonthlyExpenseAmount,
      diffFromLastMonth,
    });
  }
}
