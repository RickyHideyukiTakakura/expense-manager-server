import dayjs from "dayjs";
import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesDailyAmountUseCase } from "./get-expenses-daily-amount";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesDailyAmountUseCase;

describe("Get Expenses Daily Amount Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesDailyAmountUseCase(inMemoryExpensesRepository);
  });

  it("should be able to fetch daily expenses amount", async () => {
    const today = dayjs();
    const yesterday = today.subtract(1, "days");

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: today.toDate(), price: 10 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: today.toDate(), price: 20 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: yesterday.toDate(), price: 15 })
    );

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        dailyExpenseAmount: 30,
        diffFromYesterday: 100,
      })
    );
  });
});
