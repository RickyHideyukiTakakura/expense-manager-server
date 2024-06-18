import { UseCaseError } from "@/core/errors/use-case-error";

export class AuthLinkCodeNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Auth link code not found.`);
  }
}
