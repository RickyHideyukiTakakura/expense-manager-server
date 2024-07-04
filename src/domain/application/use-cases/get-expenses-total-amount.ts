import { Either, right } from "@/core/either";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesTotalAmountUseCaseRequest {}

export type GetExpensesTotalAmountUseCaseResponse = Either<
  null,
  {
    totalAmount: number;
  }
>;

export class GetExpensesTotalAmountUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute(): Promise<GetExpensesTotalAmountUseCaseResponse> {
    const expenses = await this.expensesRepository.findAll();

    const totalAmount = expenses.reduce(
      (totalAmount, expense) => totalAmount + expense.price,
      0
    );

    return right({
      totalAmount,
    });
  }
}
