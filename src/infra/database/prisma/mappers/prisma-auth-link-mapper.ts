import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { Prisma } from "@prisma/client";

export class PrismaAuthLinkMapper {
  // static toDomain(raw: PrismaAuthLink): AuthLink {
  //   return AuthLink.create(
  //     {
  //       name: raw.name,
  //       email: raw.email,
  //     },
  //     new UniqueEntityID(raw.id)
  //   );
  // }

  static toPrisma(authLink: AuthLink): Prisma.AuthLinkUncheckedCreateInput {
    return {
      id: authLink.id.toString(),
      code: authLink.code,
      userId: authLink.userId.toString(),
      createdAt: authLink.createdAt,
    };
  }
}
