"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Transaction, TransactionDraft } from "@/types";
import { applyFilters, getDefaultFilters } from "@/lib/filters";
import { generateMetrics } from "@/lib/analytics";
import { seedTransactions } from "@/lib/sample-data";
import type { Filters } from "@/types";

const STORAGE_KEY = "pulse-expense-tracker-v1";

const normalize = (transactions: Transaction[]) =>
  [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

const readPersistedTransactions = (): Transaction[] => {
  if (typeof window === "undefined") {
    return seedTransactions;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seedTransactions;
    }
    const parsed = JSON.parse(raw) as Transaction[];
    return normalize(parsed);
  } catch (error) {
    console.error("Failed to parse stored transactions", error);
    return seedTransactions;
  }
};

const createTransaction = (draft: TransactionDraft): Transaction => {
  const random = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);

  return {
    ...draft,
    id: `txn-${random()}`,
    date: draft.date.toISOString(),
  };
};

export const useExpenses = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    readPersistedTransactions,
  );
  const [filters, setFilters] = useState<Filters>(getDefaultFilters);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTransactions));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((draft: TransactionDraft) => {
    setTransactions((current) => normalize([createTransaction(draft), ...current]));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }, []);

  const updateFilters = useCallback((updater: (prev: Filters) => Filters) => {
    setFilters((prev) => updater(prev));
  }, []);

  const filteredTransactions = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters],
  );

  const metrics = useMemo(
    () => generateMetrics(filteredTransactions),
    [filteredTransactions],
  );

  const totals = useMemo(() => {
    const paid = filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const received = filteredTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      paid,
      received,
      net: received - paid,
    };
  }, [filteredTransactions]);

  return {
    transactions: filteredTransactions,
    rawTransactions: transactions,
    filters,
    metrics,
    totals,
    addTransaction,
    removeTransaction,
    updateFilters,
  };
};
