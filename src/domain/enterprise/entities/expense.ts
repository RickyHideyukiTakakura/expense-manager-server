import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ExpenseProps {
  userId: UniqueEntityID;
  description: string;
  category: string;
  payment: string;
  price: number;
  createdAt: Date;
}

export class Expense extends Entity<ExpenseProps> {
  get userId() {
    return this.props.userId;
  }

  get description() {
    return this.props.description;
  }

  get category() {
    return this.props.category;
  }

  get payment() {
    return this.props.payment;
  }
  get price() {
    return this.props.price;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<ExpenseProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const expense = new Expense(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return expense;
  }
}
