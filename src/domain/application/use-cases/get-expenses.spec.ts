import { makeExpense } from "test/factories/make-expense";
import { InMemoryExpensesRepository } from "test/repositories/in-memory-expenses-repository";
import { GetExpensesUseCase } from "./get-expenses";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: GetExpensesUseCase;

describe("Get Expenses Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new GetExpensesUseCase(inMemoryExpensesRepository);
  });

  it("should be able to fetch expenses", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(2024, 4, 20) })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(2024, 4, 22) })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(2024, 4, 21) })
    );

    const result = await sut.execute({
      pageIndex: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.totalItems).toEqual(3);
    expect(result.value?.expenses).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 4, 22) }),
      expect.objectContaining({ createdAt: new Date(2024, 4, 21) }),
      expect.objectContaining({ createdAt: new Date(2024, 4, 20) }),
    ]);
  });

  it("should be able to fetch filtered expenses", async () => {
    await inMemoryExpensesRepository.create(
      makeExpense({
        description: "Description test",
      })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({
        category: "Category test",
      })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({
        payment: "Payment test",
      })
    );

    await inMemoryExpensesRepository.create(
      makeExpense({ createdAt: new Date(2024, 4, 20) })
    );

    const resultDescription = await sut.execute({
      pageIndex: 1,
      description: "Description",
    });

    const resultCategory = await sut.execute({
      pageIndex: 1,
      category: "Category",
    });

    const resultPayment = await sut.execute({
      pageIndex: 1,
      payment: "Payment",
    });

    const resultCreatedAt = await sut.execute({
      pageIndex: 1,
      createdAt: new Date(2024, 4, 20).toISOString(),
    });

    expect(resultDescription.value?.expenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: "Description test",
        }),
      ])
    );

    expect(resultCategory.value?.expenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "Category test",
        }),
      ])
    );

    expect(resultPayment.value?.expenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          payment: "Payment test",
        }),
      ])
    );

    expect(resultCreatedAt.value?.expenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          createdAt: new Date(2024, 4, 20),
        }),
      ])
    );
  });

  it("should be able to fetch paginated expenses", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryExpensesRepository.create(makeExpense());
    }

    const result = await sut.execute({
      pageIndex: 3,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.expenses).toHaveLength(2);
  });
});
