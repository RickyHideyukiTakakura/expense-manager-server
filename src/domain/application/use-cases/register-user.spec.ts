import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user";

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: RegisterUserUseCase;

describe("Register Student Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new RegisterUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to register a user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items).toHaveLength(1);
  });

  it("should not be able to register a user with email already exists", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
