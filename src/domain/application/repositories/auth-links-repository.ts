import { AuthLink } from "@/domain/enterprise/entities/auth-link";

export interface AuthLinksRepository {
  findByQueryCode(code: string): Promise<AuthLink | null>;
  delete(authLink: AuthLink): Promise<void>;
  create(authLink: AuthLink): Promise<void>;
}
