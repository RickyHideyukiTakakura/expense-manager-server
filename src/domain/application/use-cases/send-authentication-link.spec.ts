import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { SendAuthenticationLinkUseCase } from "./send-authentication-link";

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: SendAuthenticationLinkUseCase;

describe("Send Authenticate Link Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new SendAuthenticationLinkUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user = makeUser({
      email: "johndoe@example.com",
    });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      email: "johndoe@example.com",
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      authLinkCode: expect.any(String),
    });
  });
});
