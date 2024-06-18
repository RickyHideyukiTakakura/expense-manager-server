import { Either, left, right } from "@/core/either";
import { Encrypter } from "../cryptography/encrypter";
import { AuthLinksRepository } from "../repositories/auth-links-repository";
import { AuthLinkCodeNotFoundError } from "./errors/auth-link-code-not-found";

export interface AuthenticateFromLinkUseCaseQuery {
  code: string;
}

export type AuthenticateFromLinkUseCaseResponse = Either<
  AuthLinkCodeNotFoundError,
  {
    accessToken: string;
  }
>;

export class AuthenticateFromLinkUseCase {
  constructor(
    private authLinksRepository: AuthLinksRepository,
    private encrpyter: Encrypter
  ) {}

  async execute({
    code,
  }: AuthenticateFromLinkUseCaseQuery): Promise<AuthenticateFromLinkUseCaseResponse> {
    const authLinkCode = await this.authLinksRepository.findByQueryCode(code);

    if (!authLinkCode) {
      return left(new AuthLinkCodeNotFoundError());
    }

    const accessToken = await this.encrpyter.encrypt({
      sub: authLinkCode.userId,
    });

    await this.authLinksRepository.delete(authLinkCode);

    return right({
      accessToken,
    });
  }
}
