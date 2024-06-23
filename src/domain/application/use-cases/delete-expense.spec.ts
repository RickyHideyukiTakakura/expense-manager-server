import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { DeleteExpenseUseCase } from "./delete-expense";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: DeleteExpenseUseCase;

describe("Delete Expense Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new DeleteExpenseUseCase(inMemoryExpensesRepository);
  });

  it("should be able to delete an expense", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense(
        {
          userId: new UniqueEntityID("user-01"),
        },
        new UniqueEntityID("expense-01")
      )
    );

    const result = await sut.execute({
      id: "expense-01",
      userId: "user-01",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryExpensesRepository.items).toHaveLength(0);
  });

  it("should not be able to delete an expense from another user", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense(
        {
          userId: new UniqueEntityID("user-01"),
        },
        new UniqueEntityID("expense-01")
      )
    );

    const result = await sut.execute({
      id: "expense-01",
      userId: "user-02",
    });

    expect(result.isLeft()).toBe(true);
    expect(inMemoryExpensesRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
