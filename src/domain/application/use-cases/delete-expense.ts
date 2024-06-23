import { Either, left, right } from "@/core/either";
import { ExpensesRepository } from "../repositories/expenses-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteExpenseUseCaseRequest {
  id: string;
  userId: string;
}

type DeleteExpenseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    id,
    userId,
  }: DeleteExpenseUseCaseRequest): Promise<DeleteExpenseResponse> {
    const expense = await this.expensesRepository.findById(id);

    if (!expense) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== expense.userId.toString()) {
      return left(new NotAllowedError());
    }

    await this.expensesRepository.delete(expense);

    return right(null);
  }
}
