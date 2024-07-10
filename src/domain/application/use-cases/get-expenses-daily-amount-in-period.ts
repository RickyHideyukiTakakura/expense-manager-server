import { Either, right } from "@/core/either";
import dayjs from "dayjs";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesDailyAmountInPeriodUseCaseRequest {
  from?: string;
  to?: string;
}

export type GetExpensesDailyAmountInPeriodUseCaseResponse = Either<
  null,
  {
    expensesAmountInPeriod: {
      amount: number;
      date: string;
    }[];
  }
>;

export class GetExpensesDailyAmountInPeriodUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    from,
    to,
  }: GetExpensesDailyAmountInPeriodUseCaseRequest): Promise<GetExpensesDailyAmountInPeriodUseCaseResponse> {
    const startDate = from ? dayjs(from) : dayjs().subtract(7, "days");
    const endDate = to ? dayjs(to) : from ? startDate.add(7, "days") : dayjs();

    if (endDate.diff(startDate, "days") > 7) {
      throw new Error("Interval cannot be over 7 days");
    }

    const expensesAmountInPeriod = await this.expensesRepository.findByPeriod({
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    });

    return right({
      expensesAmountInPeriod,
    });
  }
}
