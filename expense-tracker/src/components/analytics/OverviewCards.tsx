"use client";

import { MetricSet } from "@/lib/analytics";
import { formatCurrency } from "@/lib/formatters";
import clsx from "clsx";
import {
  ArrowDownRightIcon,
  ArrowPathIcon,
  ArrowUpRightIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

interface OverviewCardsProps {
  metrics: MetricSet;
  totals: {
    paid: number;
    received: number;
    net: number;
  };
}

const cards = [
  {
    key: "inflow" as const,
    label: "Cash In",
    icon: ArrowDownRightIcon,
    accent: "text-emerald-400 bg-emerald-500/10",
  },
  {
    key: "outflow" as const,
    label: "Cash Out",
    icon: ArrowUpRightIcon,
    accent: "text-rose-400 bg-rose-500/10",
  },
  {
    key: "balance" as const,
    label: "Net Position",
    icon: BanknotesIcon,
    accent: "text-sky-400 bg-sky-500/10",
  },
  {
    key: "burnRate" as const,
    label: "Avg. Monthly Burn",
    icon: ArrowPathIcon,
    accent: "text-amber-400 bg-amber-500/10",
  },
];

export const OverviewCards = ({ metrics, totals }: OverviewCardsProps) => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, accent }) => (
        <article key={key} className="card space-y-4">
          <div className={clsx("inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium", accent)}>
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
          <p className="text-3xl font-semibold tracking-tight">
            {formatCurrency(metrics[key])}
          </p>
          <p className="text-sm text-[var(--muted)]">
            {key === "balance"
              ? `${formatCurrency(totals.received)} received · ${formatCurrency(totals.paid)} paid`
              : key === "burnRate"
              ? "Rolling 90 day average burn"
              : key === "inflow"
              ? "Projected inflows this period"
              : "Actual spend this period"}
          </p>
        </article>
      ))}
    </section>
  );
};
