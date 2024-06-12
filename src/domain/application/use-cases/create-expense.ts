import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense } from "@/domain/enterprise/entities/expense";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface CreateExpenseUseCaseRequest {
  userId: string;
  description: string;
  category: string;
  method: string;
  price: number;
}

export type CreateExpenseUseCaseResponse = Either<
  null,
  {
    expense: Expense;
  }
>;

export class CreateExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    userId,
    description,
    category,
    method,
    price,
  }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
    const expense = Expense.create({
      userId: new UniqueEntityID(userId),
      description,
      category,
      method,
      price,
    });

    await this.expensesRepository.create(expense);

    return right({
      expense,
    });
  }
}
