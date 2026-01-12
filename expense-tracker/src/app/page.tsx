"use client";

import { ControlPanel } from "@/components/filters/ControlPanel";
import { OverviewCards } from "@/components/analytics/OverviewCards";
import { MonthlyTrend } from "@/components/analytics/MonthlyTrend";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";
import { UpcomingExpenses } from "@/components/analytics/UpcomingExpenses";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { useExpenses } from "@/hooks/use-expenses";
import { Filters } from "@/types";

export default function Dashboard() {
  const {
    transactions,
    filters,
    metrics,
    totals,
    addTransaction,
    removeTransaction,
    updateFilters,
  } = useExpenses();

  const handleFiltersChange = (next: Filters) => {
    updateFilters(() => next);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-12 md:px-8">
        <ControlPanel filters={filters} totals={totals} onChange={handleFiltersChange} />
        <OverviewCards metrics={metrics} totals={totals} />

        <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <MonthlyTrend metrics={metrics} />
          <CategoryBreakdown metrics={metrics} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <TransactionForm onSubmit={addTransaction} />
          <UpcomingExpenses metrics={metrics} />
        </section>

        <TransactionTable transactions={transactions} onDelete={removeTransaction} />
      </div>
    </main>
  );
}
