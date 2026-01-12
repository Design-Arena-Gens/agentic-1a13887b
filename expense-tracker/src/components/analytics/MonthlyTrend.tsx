"use client";

import { useEffect, useState } from "react";
import { MetricSet } from "@/lib/analytics";
import { formatCurrency, formatMonth } from "@/lib/formatters";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyTrendProps {
  metrics: MetricSet;
}

export const MonthlyTrend = ({ metrics }: MonthlyTrendProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <article className="card flex h-80 items-center justify-center text-sm text-[var(--muted)]">
        Loading cashflow trend…
      </article>
    );
  }

  const data = metrics.monthlyTotals.map((month) => ({
    ...month,
    label: formatMonth(`${month.month}-01`),
    net: month.income - month.expense,
  }));

  return (
    <article className="card flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted)]">
            Performance
          </p>
          <h3 className="text-lg font-semibold">Cashflow Trend</h3>
        </div>
        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
          Rolling 12 months
        </span>
      </header>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(Number(value)).replace("$", "$ ")}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              cursor={{
                stroke: "rgba(148, 163, 184, 0.35)",
                strokeWidth: 1,
              }}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "12px",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                color: "#f8fafc",
              }}
              formatter={(value, name) => {
                const label = typeof name === "string" ? name : `${name}`;
                return [
                  formatCurrency(typeof value === "number" ? value : Number(value ?? 0)),
                  label === "income" ? "Inflow" : label === "expense" ? "Outflow" : "Net",
                ];
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#34d399"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};
