import { Either, right } from "@/core/either";
import { Expense } from "@/domain/enterprise/entities/expense";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetExpensesUseCaseRequest {
  pageIndex: number;
  description?: string;
  category?: string;
  payment?: string;
  createdAt?: Date;
}

export type GetExpensesUseCaseResponse = Either<
  null,
  {
    expenses: Expense[];
    totalItems: number;
  }
>;

export class GetExpensesUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    pageIndex,
    description,
    category,
    payment,
    createdAt,
  }: GetExpensesUseCaseRequest): Promise<GetExpensesUseCaseResponse> {
    const expenses = await this.expensesRepository.findMany({
      pageIndex,
      description,
      category,
      payment,
      createdAt,
    });

    const totalItems = await this.expensesRepository.findTotalItems({
      pageIndex,
      description,
      category,
      payment,
      createdAt,
    });

    return right({
      expenses,
      totalItems,
    });
  }
}
