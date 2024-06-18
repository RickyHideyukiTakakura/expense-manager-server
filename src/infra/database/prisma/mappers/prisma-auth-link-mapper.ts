import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { Prisma, AuthLink as PrismaAuthLink } from "@prisma/client";

export class PrismaAuthLinkMapper {
  static toDomain(raw: PrismaAuthLink): AuthLink {
    return AuthLink.create(
      {
        userId: new UniqueEntityID(raw.userId),
        code: raw.code,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(authLink: AuthLink): Prisma.AuthLinkUncheckedCreateInput {
    return {
      id: authLink.id.toString(),
      code: authLink.code,
      userId: authLink.userId.toString(),
      createdAt: authLink.createdAt,
    };
  }
}
