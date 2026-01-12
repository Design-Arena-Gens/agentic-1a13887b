"use client";

import { MetricSet } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface UpcomingExpensesProps {
  metrics: MetricSet;
}

export const UpcomingExpenses = ({ metrics }: UpcomingExpensesProps) => {
  return (
    <article className="card flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted)]">
            Forecast
          </p>
          <h3 className="text-lg font-semibold">Upcoming cash outs</h3>
        </div>
        <CalendarIcon className="h-5 w-5 text-brand-300" />
      </header>
      <ul className="space-y-3">
        {metrics.upcoming.length === 0 && (
          <li className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-[var(--muted)]">
            No upcoming spend tracked. Log future-dated expenses to forecast cash needs.
          </li>
        )}
        {metrics.upcoming.map((transaction) => (
          <li
            key={transaction.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">{transaction.description}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatDate(transaction.date)} · {transaction.category}
              </p>
            </div>
            <span className="text-sm font-semibold text-rose-400">
              -{formatCurrency(transaction.amount)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};
