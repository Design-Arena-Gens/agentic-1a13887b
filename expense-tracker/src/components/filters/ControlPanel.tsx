"use client";

import { ChangeEvent } from "react";
import { TIME_RANGE_LABELS } from "@/lib/filters";
import { Filters, TransactionType } from "@/types";
import { ACCOUNT_TYPES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import clsx from "clsx";
import { formatCurrency } from "@/lib/formatters";

interface ControlPanelProps {
  filters: Filters;
  totals: {
    paid: number;
    received: number;
    net: number;
  };
  onChange: (filters: Filters) => void;
}

const transactionTypes: Array<TransactionType | "all"> = ["all", "expense", "income"];

export const ControlPanel = ({ filters, totals, onChange }: ControlPanelProps) => {
  const handleChange =
    (key: keyof Filters) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      onChange({
        ...filters,
        [key]:
          key === "type"
            ? (value as TransactionType | "all")
            : key === "timeRange"
            ? (value as Filters["timeRange"])
            : key === "account"
            ? value
            : value,
      });
    };

  const handleDateChange = (key: "from" | "to") => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? new Date(event.target.value) : null;
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: event.target.value });
  };

  return (
    <section className="card flex flex-col gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted)]">
            Executive Overview
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Expense Intelligence</h2>
        </div>
        <div className="grid gap-2 text-right text-sm text-[var(--muted)]">
          <span>
            Incoming <strong className="ml-1 text-emerald-400">{formatCurrency(totals.received)}</strong>
          </span>
          <span>
            Outgoing <strong className="ml-1 text-rose-400">{formatCurrency(totals.paid)}</strong>
          </span>
          <span>
            Net position{" "}
            <strong
              className={clsx("ml-1", totals.net >= 0 ? "text-emerald-400" : "text-rose-400")}
            >
              {formatCurrency(totals.net)}
            </strong>
          </span>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Period
          </span>
          <select
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            value={filters.timeRange}
            onChange={(event) =>
              onChange({
                ...filters,
                timeRange: event.target.value as Filters["timeRange"],
                from: event.target.value === "CUSTOM" ? filters.from : null,
                to: event.target.value === "CUSTOM" ? filters.to : null,
              })
            }
          >
            {Object.entries(TIME_RANGE_LABELS).map(([value, label]) => (
              <option className="bg-[var(--card)] text-[var(--foreground)]" key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Transaction type
          </span>
          <select
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            value={filters.type}
            onChange={handleChange("type")}
          >
            {transactionTypes.map((type) => (
              <option key={type} className="bg-[var(--card)] text-[var(--foreground)]" value={type}>
                {type === "all" ? "All transactions" : type === "income" ? "Inflow" : "Outflow"}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Category
          </span>
          <select
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value,
              })
            }
          >
            <option className="bg-[var(--card)] text-[var(--foreground)]" value="all">
              All categories
            </option>
            <optgroup label="Expenses">
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </optgroup>
            <optgroup label="Income">
              {INCOME_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Search
          </span>
          <input
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none placeholder:text-[var(--muted)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            placeholder="Search memo, notes, vendor…"
            value={filters.search}
            onChange={handleSearch}
          />
        </label>
      </div>
      {filters.timeRange === "CUSTOM" && (
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              From
            </span>
            <input
              type="date"
              value={filters.from ? filters.from.toISOString().slice(0, 10) : ""}
              onChange={handleDateChange("from")}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              To
            </span>
            <input
              type="date"
              value={filters.to ? filters.to.toISOString().slice(0, 10) : ""}
              onChange={handleDateChange("to")}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Account
          </span>
          <select
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            value={filters.account}
            onChange={handleChange("account")}
          >
            <option className="bg-[var(--card)] text-[var(--foreground)]" value="all">
              All accounts
            </option>
            {ACCOUNT_TYPES.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};
