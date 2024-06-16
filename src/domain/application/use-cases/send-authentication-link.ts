import { Either, left, right } from "@/core/either";
import { randomUUID } from "node:crypto";
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
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: SendAuthenticationLinkUseCaseRequest): Promise<SendAuthenticationLinkUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const authLinkCode = randomUUID();

    return right({
      authLinkCode,
    });
  }
}
