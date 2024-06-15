import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/enterprise/entities/user";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(student: User): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
    };
  }
}
