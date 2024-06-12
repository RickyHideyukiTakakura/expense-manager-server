import { Either, left, right } from "@/core/either";
import { User } from "@/domain/enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

export interface RegisterUserUseCaseRequest {
  name: string;
  email: string;
}

export type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const user = User.create({
      name,
      email,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
