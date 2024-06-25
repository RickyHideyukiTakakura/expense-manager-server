import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense } from "@/domain/enterprise/entities/expense";
import { ExpensesRepository } from "../repositories/expenses-repository";

export interface CreateExpenseUseCaseRequest {
  userId: string;
  description: string;
  category: string;
  payment: string;
  price: number;
  createdAt?: Date;
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
    payment,
    price,
    createdAt,
  }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
    const expense = Expense.create({
      userId: new UniqueEntityID(userId),
      description,
      category,
      payment,
      price,
      createdAt,
    });

    await this.expensesRepository.create(expense);

    return right({
      expense,
    });
  }
}
