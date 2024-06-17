import { AuthLinksRepository } from "@/domain/application/repositories/auth-links-repository";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { prisma } from "@/infra/lib/prisma";
import { PrismaAuthLinkMapper } from "../mappers/prisma-auth-link-mapper";

export class PrismaAuthLinksRepository implements AuthLinksRepository {
  async create(authLink: AuthLink): Promise<void> {
    const data = PrismaAuthLinkMapper.toPrisma(authLink);

    await prisma.authLink.create({
      data,
    });
  }
}
