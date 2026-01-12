"use client";

import { useEffect, useState } from "react";
import { MetricSet } from "@/lib/analytics";
import { formatCurrency } from "@/lib/formatters";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const palette = [
  "#6366f1",
  "#ec4899",
  "#f97316",
  "#22d3ee",
  "#34d399",
  "#facc15",
  "#94a3b8",
];

interface CategoryBreakdownProps {
  metrics: MetricSet;
}

export const CategoryBreakdown = ({ metrics }: CategoryBreakdownProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <article className="card flex h-72 items-center justify-center text-sm text-[var(--muted)]">
        Loading category insights…
      </article>
    );
  }

  const hasData = metrics.topCategories.length > 0;

  return (
    <article className="card flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted)]">
            Spend Concentration
          </p>
          <h3 className="text-lg font-semibold">Top Categories</h3>
        </div>
      </header>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-72 flex-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={240}>
            <PieChart>
              <Pie
                data={metrics.topCategories.map((item, index) => ({
                  name: item.name,
                  value: Math.abs(item.total),
                  fill: palette[index % palette.length],
                }))}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                cornerRadius={8}
              >
                {metrics.topCategories.map((_, index) => (
                  <Cell key={index} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  borderRadius: "12px",
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  color: "#f8fafc",
                }}
                formatter={(value) => [
                  formatCurrency(typeof value === "number" ? value : Number(value ?? 0)),
                  "Spend",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-1 flex-col gap-4">
          {hasData ? (
            metrics.topCategories.map((item, index) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: palette[index % palette.length] }}
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.count} {item.count > 1 ? "transactions" : "transaction"}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {formatCurrency(Math.abs(item.total))}
                </p>
              </li>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
              No category insights yet – start tracking spend.
            </div>
          )}
        </ul>
      </div>
    </article>
  );
};
