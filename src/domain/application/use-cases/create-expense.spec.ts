import { InMemoryExpensesRepository } from "@/test/repositories/in-memory-expenses-repository";
import { CreateExpenseUseCase } from "./create-expense";

let inMemoryExpensesRepository: InMemoryExpensesRepository;

let sut: CreateExpenseUseCase;

describe("Create Expense Use Case", () => {
  beforeEach(() => {
    inMemoryExpensesRepository = new InMemoryExpensesRepository();

    sut = new CreateExpenseUseCase(inMemoryExpensesRepository);
  });

  it("should be able to create a expense", async () => {
    const result = await sut.execute({
      userId: "1",
      description: "Netflix",
      category: "Streaming",
      method: "Credit card",
      price: 55,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryExpensesRepository.items[0]).toEqual(result.value?.expense);
    expect(inMemoryExpensesRepository.items).toHaveLength(1);
  });
});
