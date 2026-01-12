"use client";

import { formatDistanceToNow } from "date-fns";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Transaction } from "@/types";
import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionTable = ({
  transactions,
  onDelete,
}: TransactionTableProps) => {
  return (
    <section className="card flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted)]">
            Ledger
          </p>
          <h3 className="text-lg font-semibold">All transactions</h3>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] transition hover:border-white/20 hover:text-white">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export CSV
        </button>
      </header>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="table-gradient overflow-auto">
          <table className="min-w-full divide-y divide-white/5 text-sm">
            <thead>
              <tr className="uppercase tracking-wide text-[var(--muted)]">
                <th className="px-4 py-3 text-left font-medium">Details</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Account</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Age</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="transition hover:bg-white/[0.04]">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {transaction.description}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {formatDate(transaction.date)}
                        {transaction.project ? ` · ${transaction.project}` : ""}
                      </span>
                      {transaction.notes && (
                        <span className="mt-1 text-xs text-brand-200">
                          {transaction.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium">
                      <ArrowUpRightIcon className="h-3.5 w-3.5 text-brand-300" />
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--muted)]">
                    {transaction.account}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={clsx(
                        "font-semibold",
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-rose-400",
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-xs text-[var(--muted)]">
                    {formatDistanceToNow(new Date(transaction.date), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--muted)] transition hover:border-rose-500 hover:text-rose-400"
                      aria-label="Delete transaction"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {transactions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center text-sm text-[var(--muted)]">
          No records for the selected filters. Log a new transaction to populate your dashboard.
        </div>
      )}
    </section>
  );
};
