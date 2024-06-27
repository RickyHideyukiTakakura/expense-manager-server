export interface ExpenseParams {
  pageIndex: number;
  description?: string;
  category?: string;
  payment?: string;
  createdAt?: Date;
}
