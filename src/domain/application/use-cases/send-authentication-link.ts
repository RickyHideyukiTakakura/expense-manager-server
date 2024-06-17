import { Either, left, right } from "@/core/either";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { randomUUID } from "node:crypto";
import { AuthLinksRepository } from "../repositories/auth-links-repository";
import { UsersRepository } from "../repositories/users-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

export interface SendAuthenticationLinkUseCaseRequest {
  email: string;
}

export type SendAuthenticationLinkUseCaseResponse = Either<
  WrongCredentialsError,
  {
    authLinkCode: string;
  }
>;

export class SendAuthenticationLinkUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private authLinksRepository: AuthLinksRepository
  ) {}

  async execute({
    email,
  }: SendAuthenticationLinkUseCaseRequest): Promise<SendAuthenticationLinkUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const authLinkCode = randomUUID();

    const authLink = AuthLink.create({
      code: authLinkCode,
      userId: user.id.toString(),
    });

    await this.authLinksRepository.create(authLink);

    return right({
      authLinkCode,
    });
  }
}
