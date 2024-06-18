import { AuthLinksRepository } from "@/domain/application/repositories/auth-links-repository";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";

export class InMemoryAuthLinksRepository implements AuthLinksRepository {
  public items: AuthLink[] = [];

  async findByQueryCode(code: string) {
    const authLink = this.items.find((item) => item.code === code);

    if (!authLink) {
      return null;
    }

    return authLink;
  }

  async delete(authLink: AuthLink) {
    const itemIndex = this.items.findIndex((item) => item.id === authLink.id);

    this.items.splice(itemIndex, 1);
  }

  async create(authLink: AuthLink) {
    this.items.push(authLink);
  }
}
