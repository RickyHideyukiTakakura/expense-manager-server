import dayjs from "dayjs";
import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesMonthlyAmountUseCase } from "./get-expenses-monthly-amount";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesMonthlyAmountUseCase;

describe("Get Expenses Monthly Amount Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesMonthlyAmountUseCase(inMemoryExpensesRepository);
  });

  it("should be able to fetch monthly expenses amount", async () => {
    const today = dayjs();
    const lastMonth = today.subtract(1, "months");

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: today.toDate(), price: 10 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: today.toDate(), price: 20 })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: lastMonth.toDate(), price: 15 })
    );

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        currentMonthlyExpenseAmount: 30,
        diffFromLastMonth: 100,
      })
    );
  });
});
