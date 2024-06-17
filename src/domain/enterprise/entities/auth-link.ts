import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AuthLinkProps {
  code: string;
  userId: string;
  createdAt: Date;
}

export class AuthLink extends Entity<AuthLinkProps> {
  get code() {
    return this.props.code;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<AuthLinkProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const authLink = new AuthLink(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return authLink;
  }
}
