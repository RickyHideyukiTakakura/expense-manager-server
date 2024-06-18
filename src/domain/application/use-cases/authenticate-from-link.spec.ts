import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeUser } from "test/factories/make-user";
import { InMemoryAuthLinksRepository } from "test/repositories/in-memory-auth-links-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { AuthenticateFromLinkUseCase } from "./authenticate-from-link";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAuthLinksRepository: InMemoryAuthLinksRepository;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateFromLinkUseCase;

describe("Authenticate From Link Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAuthLinksRepository = new InMemoryAuthLinksRepository();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateFromLinkUseCase(
      inMemoryAuthLinksRepository,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a user", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);

    const authLinkCode = AuthLink.create({
      userId: user.id.toString(),
      code: "auth-link-code",
    });

    inMemoryAuthLinksRepository.create(authLinkCode);

    const result = await sut.execute({
      code: authLinkCode.code,
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
