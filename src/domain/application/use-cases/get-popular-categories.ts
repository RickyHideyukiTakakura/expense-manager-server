import { Either, right } from "@/core/either";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface GetPopularCategoriesUseCaseRequest {}

export type GetPopularCategoriesUseCaseResponse = Either<
  null,
  {
    categories: {
      category: string;
      amount: number;
    }[];
  }
>;

export class GetPopularCategoriesUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute(): Promise<GetPopularCategoriesUseCaseResponse> {
    const categories = await this.expensesRepository.findCategories();

    return right({
      categories,
    });
  }
}
