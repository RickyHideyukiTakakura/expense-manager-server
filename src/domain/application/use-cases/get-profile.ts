import { Either, left, right } from "@/core/either";
import { User } from "@/domain/enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export interface GetProfileUseCaseRequest {
  id: string;
}

export type GetProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({ user });
  }
}
