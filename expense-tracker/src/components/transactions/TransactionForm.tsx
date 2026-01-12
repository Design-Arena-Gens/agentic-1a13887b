"use client";

import { FormEvent, useMemo, useState } from "react";
import { TransactionDraft, TransactionType } from "@/types";
import {
  ACCOUNT_TYPES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/constants/categories";
import clsx from "clsx";

interface TransactionFormProps {
  onSubmit: (draft: TransactionDraft) => void;
}

const defaultState: TransactionDraft = {
  type: "expense",
  amount: 0,
  category: "Other",
  description: "",
  date: new Date(),
  account: "Corporate Card",
  project: "",
  notes: "",
};

const categoryOptions: Record<TransactionType, string[]> = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
};

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [draft, setDraft] = useState<TransactionDraft>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      draft.description.trim().length > 0 &&
      draft.amount > 0 &&
      Boolean(draft.category),
    [draft],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    onSubmit(draft);
    setDraft({
      ...defaultState,
      type: draft.type,
      category: draft.category,
      account: draft.account,
      date: new Date(),
    });
    setTimeout(() => setIsSubmitting(false), 250);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-6 border-dashed border-white/10 bg-white/[0.02]"
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">Log a new transaction</h3>
        <p className="text-sm text-[var(--muted)]">
          Capture expenses or inflows with enriched metadata for faster reporting insights.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Type
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as TransactionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    type,
                    category: categoryOptions[type][0],
                  }))
                }
                className={clsx(
                  "rounded-xl border px-3 py-2 text-sm font-medium transition",
                  draft.type === type
                    ? "border-brand-500 bg-brand-500/15 text-brand-200"
                    : "border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-white/20",
                )}
              >
                {type === "expense" ? "Expense" : "Income"}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Amount
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={draft.amount ? draft.amount : ""}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                amount: Number(event.target.value),
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Category
          </span>
          <select
            value={draft.category}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          >
            {categoryOptions[draft.type].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Date
          </span>
          <input
            type="date"
            value={draft.date.toISOString().slice(0, 10)}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                date: new Date(event.target.value),
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Description
          </span>
          <input
            placeholder="Vendor, memo, campaign…"
            value={draft.description}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Account
          </span>
          <select
            value={draft.account}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                account: event.target.value,
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          >
            {ACCOUNT_TYPES.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Project / Tag
          </span>
          <input
            placeholder="Optional tag to group insights"
            value={draft.project ?? ""}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                project: event.target.value,
              }))
            }
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Internal notes
        </span>
        <textarea
          rows={3}
          placeholder="Context for finance team, approvals, receipts…"
          value={draft.notes ?? ""}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              notes: event.target.value,
            }))
          }
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
        />
      </label>
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--muted)]">
          Entries sync automatically and persist locally. Export support coming soon.
        </p>
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={clsx(
            "inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[var(--muted)]",
          )}
        >
          {isSubmitting ? "Logging…" : "Add transaction"}
        </button>
      </div>
    </form>
  );
};
