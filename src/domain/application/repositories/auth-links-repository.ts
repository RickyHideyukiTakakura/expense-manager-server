import { AuthLink } from "@/domain/enterprise/entities/auth-link";

export interface AuthLinksRepository {
  create(authLink: AuthLink): Promise<void>;
}
