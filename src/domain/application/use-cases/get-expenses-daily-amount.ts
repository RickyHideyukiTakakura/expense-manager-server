import { Either, right } from "@/core/either";
import dayjs from "dayjs";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesDailyAmountUseCaseRequest {}

export type GetExpensesDailyAmountUseCaseResponse = Either<
  null,
  {
    dailyExpenseAmount: number;
    diffFromYesterday: number;
  }
>;

export class GetExpensesDailyAmountUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute(): Promise<GetExpensesDailyAmountUseCaseResponse> {
    const today = dayjs();
    const yesterday = today.subtract(1, "days");

    const todayWithFullDate = today.format("YYYY-MM-DD");
    const yesterdayWithFullDate = yesterday.format("YYYY-MM-DD");

    const todayExpenses = await this.expensesRepository.findByDay(
      todayWithFullDate
    );

    const yesterdayExpenses = await this.expensesRepository.findByDay(
      yesterdayWithFullDate
    );

    const dailyExpenseAmount = todayExpenses?.reduce(
      (total, expense) => total + expense.price,
      0
    );

    const yesterdayExpenseAmount = yesterdayExpenses?.reduce(
      (total, expense) => total + expense.price,
      0
    );

    const diffFromYesterday =
      dailyExpenseAmount && yesterdayExpenseAmount
        ? ((dailyExpenseAmount - yesterdayExpenseAmount) /
            yesterdayExpenseAmount) *
          100
        : 0;

    return right({
      dailyExpenseAmount,
      diffFromYesterday,
    });
  }
}
