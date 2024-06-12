import { Either, right } from "@/core/either";
import { Expense } from "@/domain/enterprise/entities/expense";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesUseCaseRequest {
  pageIndex: number;
}

export type GetExpensesUseCaseResponse = Either<
  null,
  {
    expenses: Expense[];
  }
>;

export class GetExpensesUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    pageIndex,
  }: GetExpensesUseCaseRequest): Promise<GetExpensesUseCaseResponse> {
    const expenses = await this.expensesRepository.findMany({
      pageIndex,
    });

    return right({
      expenses,
    });
  }
}
