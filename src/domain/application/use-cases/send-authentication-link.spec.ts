import { makeUser } from "test/factories/make-user";
import { InMemoryAuthLinksRepository } from "test/repositories/in-memory-auth-links-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { SendAuthenticationLinkUseCase } from "./send-authentication-link";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAuthLinksRepository: InMemoryAuthLinksRepository;

let sut: SendAuthenticationLinkUseCase;

describe("Send Authenticate Link Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAuthLinksRepository = new InMemoryAuthLinksRepository();

    sut = new SendAuthenticationLinkUseCase(
      inMemoryUsersRepository,
      inMemoryAuthLinksRepository
    );
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

    expect(inMemoryAuthLinksRepository.items).toHaveLength(1);

    expect(result.value).toEqual({
      authLinkCode: expect.any(String),
    });
  });
});
