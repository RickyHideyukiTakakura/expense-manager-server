import { AuthLinksRepository } from "@/domain/application/repositories/auth-links-repository";
import { AuthLink } from "@/domain/enterprise/entities/auth-link";

export class InMemoryAuthLinksRepository implements AuthLinksRepository {
  public items: AuthLink[] = [];

  async create(authLink: AuthLink) {
    this.items.push(authLink);
  }
}
