import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Expense } from "@/domain/enterprise/entities/expense";
import { ExpensesRepository } from "../repositories/expenses-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export interface UpdateExpenseUseCaseRequest {
  id: string;
  userId: string;
  description?: string;
  category?: string;
  payment?: string;
  price?: number;
  createdAt?: Date;
}

export type UpdateExpenseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    expense: Expense;
  }
>;

export class UpdateExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    id,
    userId,
    description,
    category,
    payment,
    price,
    createdAt,
  }: UpdateExpenseUseCaseRequest): Promise<UpdateExpenseUseCaseResponse> {
    const expense = await this.expensesRepository.findById(id);

    if (!expense) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== expense.userId.toString()) {
      return left(new NotAllowedError());
    }

    const updatedExpense = Expense.create(
      {
        userId: expense.userId,
        description: description || expense.description,
        category: category || expense.category,
        payment: payment || expense.payment,
        price: price || expense.price,
        createdAt: createdAt || expense.createdAt,
      },
      new UniqueEntityID(id)
    );

    await this.expensesRepository.save(updatedExpense);

    return right({
      expense: updatedExpense,
    });
  }
}
