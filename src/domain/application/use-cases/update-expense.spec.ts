import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { UpdateExpenseUseCase } from "./update-expense";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: UpdateExpenseUseCase;

describe("Update Expense Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new UpdateExpenseUseCase(inMemoryExpensesRepository);
  });

  it("should be able to update an expense", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense(
        { userId: new UniqueEntityID("user-id") },
        new UniqueEntityID("expense-id")
      )
    );

    const result = await sut.execute({
      id: "expense-id",
      userId: "user-id",
      description: "Update description",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      expense: expect.objectContaining({
        description: "Update description",
      }),
    });
  });
});
