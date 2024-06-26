import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetProfileUseCase } from "./get-profile";

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: GetProfileUseCase;

describe("Get Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to get a profile", async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          email: "johndoe@example.com",
          name: "John Doe",
        },
        new UniqueEntityID("user 1")
      )
    );

    const result = await sut.execute({
      id: "user 1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    );
  });
});
