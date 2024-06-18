import { AuthLinksRepository } from "@/domain/application/repositories/auth-links-repository";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";
import { prisma } from "@/infra/lib/prisma";
import { PrismaAuthLinkMapper } from "../mappers/prisma-auth-link-mapper";

export class PrismaAuthLinksRepository implements AuthLinksRepository {
  async findByQueryCode(code: string): Promise<AuthLink | null> {
    const authLink = await prisma.authLink.findUnique({
      where: { code },
    });

    if (!authLink) {
      return null;
    }

    return PrismaAuthLinkMapper.toDomain(authLink);
  }

  async delete(authLink: AuthLink): Promise<void> {
    await prisma.authLink.delete({
      where: {
        id: authLink.id.toString(),
      },
    });
  }

  async create(authLink: AuthLink): Promise<void> {
    const data = PrismaAuthLinkMapper.toPrisma(authLink);

    await prisma.authLink.create({
      data,
    });
  }
}
