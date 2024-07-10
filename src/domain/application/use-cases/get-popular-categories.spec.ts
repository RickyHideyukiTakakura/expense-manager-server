import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetPopularCategoriesUseCase } from "./get-popular-categories";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetPopularCategoriesUseCase;

describe("Get Popular Categories Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetPopularCategoriesUseCase(inMemoryExpensesRepository);
  });

  it("should be able to get popular categories", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense({ category: "Category 01" })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ category: "Category 01" })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ category: "Category 02" })
    );

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "Category 01",
          amount: 2,
        }),
        expect.objectContaining({
          category: "Category 02",
          amount: 1,
        }),
      ])
    );
  });
});
