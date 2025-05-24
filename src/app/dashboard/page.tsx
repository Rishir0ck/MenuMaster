
import { AppShell } from '@/components/layout/AppShell';
import { placeholderMonthlySummaries, placeholderOverviewStats } from '@/lib/placeholder-data';
import type { MonthlyOrderSummary, OverviewStats } from '@/lib/types';
import { DashboardClientContent } from '@/components/dashboard/DashboardClientContent';

// Dummy data fetching functions (replace with actual API calls)
async function getOverviewStats(): Promise<OverviewStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return placeholderOverviewStats;
}

async function getMonthlySummaries(): Promise<MonthlyOrderSummary[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return placeholderMonthlySummaries;
}

export default async function DashboardPage() {
  const stats = await getOverviewStats();
  const monthlyData = await getMonthlySummaries();

  return (
    <AppShell pageTitle="Dashboard Overview">
      <DashboardClientContent stats={stats} monthlyData={monthlyData} />
    </AppShell>
  );
}
