import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesTotalAmountUseCase } from "./get-expenses-total-amount";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesTotalAmountUseCase;

describe("Get Expenses Total Amount Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesTotalAmountUseCase(inMemoryExpensesRepository);
  });

  it("should be able to fetch expenses", async () => {
    await inMemoryExpensesRepository.create(makeExpense({ price: 10 }));

    await inMemoryExpensesRepository.create(makeExpense({ price: 20 }));

    await inMemoryExpensesRepository.create(makeExpense({ price: 30 }));

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value?.totalAmount).toEqual(60);
  });
});
