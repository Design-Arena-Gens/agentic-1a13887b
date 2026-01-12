"use client";

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  account: string;
  project?: string;
  notes?: string;
}

export interface TransactionDraft
  extends Omit<Transaction, "id" | "date"> {
  date: Date;
}

export type TimeRangeKey =
  | "ALL"
  | "MONTH_TO_DATE"
  | "LAST_MONTH"
  | "LAST_90_DAYS"
  | "YEAR_TO_DATE"
  | "CUSTOM";

export interface Filters {
  timeRange: TimeRangeKey;
  category: string;
  type: TransactionType | "all";
  search: string;
  account: string;
  from?: Date | null;
  to?: Date | null;
}
