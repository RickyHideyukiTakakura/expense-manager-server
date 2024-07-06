import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesMonthlyAmountUseCase } from "./get-expenses-monthly-amount";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesMonthlyAmountUseCase;

describe("Get Expenses Total Amount Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesMonthlyAmountUseCase(inMemoryExpensesRepository);
  });

  it("should be able to fetch expenses", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(), price: 10 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(), price: 20 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(2024, 5, 11), price: 15 })
    );

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        currentMonthlyExpenseAmount: 30,
      })
    );
  });
});
