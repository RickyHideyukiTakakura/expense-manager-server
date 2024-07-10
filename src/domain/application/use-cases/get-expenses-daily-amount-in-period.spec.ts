import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesDailyAmountInPeriodUseCase } from "./get-expenses-daily-amount-in-period";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesDailyAmountInPeriodUseCase;

describe("Get Expenses Amount in Period Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesDailyAmountInPeriodUseCase(inMemoryExpensesRepository);
  });

  it("should be able to get expenses amount in period", async () => {
    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 16);

    await inMemoryExpensesRepository.create(
      makeExpense({ price: 10, createdAt: new Date(2024, 5, 10) })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ price: 10, createdAt: new Date(2024, 5, 10) })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ price: 10, createdAt: new Date(2024, 5, 16) })
    );

    const result = await sut.execute({
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.expensesAmountInPeriod).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: 20,
          date: new Date(2024, 5, 10).toISOString(),
        }),
        expect.objectContaining({
          amount: 10,
          date: new Date(2024, 5, 16).toISOString(),
        }),
      ])
    );
  });
});
