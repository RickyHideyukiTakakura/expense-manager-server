import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AuthLink,
  AuthLinkProps,
} from "@/domain/enterprise/entities/auth-link";
import { PrismaAuthLinkMapper } from "@/infra/database/prisma/mappers/prisma-auth-link-mapper";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export function makeAuthLink(
  override: Partial<AuthLinkProps> = {},
  id?: UniqueEntityID
) {
  const authLink = AuthLink.create(
    {
      userId: new UniqueEntityID(),
      code: faker.string.uuid(),
      ...override,
    },
    id
  );

  return authLink;
}

export class AuthLinkFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaAuthLink(
    data: Partial<AuthLinkProps> = {}
  ): Promise<AuthLink> {
    const authLink = makeAuthLink(data);

    await this.prisma.authLink.create({
      data: PrismaAuthLinkMapper.toPrisma(authLink),
    });

    return authLink;
  }
}
