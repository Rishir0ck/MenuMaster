
"use client";

import type { MonthlyOrderSummary, OverviewStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertTriangle, ListChecks, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

interface DashboardClientContentProps {
  stats: OverviewStats;
  monthlyData: MonthlyOrderSummary[];
}

const chartConfig = {
  totalRevenue: {
    label: "Revenue (₹)",
    color: "hsl(var(--chart-1))",
  },
  totalOrders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
};

export function DashboardClientContent({ stats, monthlyData }: DashboardClientContentProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Review new applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active SKUs</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSkus}</div>
            <p className="text-xs text-muted-foreground">+15 since last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Order Summary</CardTitle>
            <CardDescription>Total orders and revenue (₹) over the past few months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}> {/* Adjusted left margin for YAxis ticks */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="hsl(var(--chart-1))" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="hsl(var(--chart-2))" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tickFormatter={(value) => Number(value).toLocaleString('en-IN')}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => {
                    if (name === 'Revenue') {
                      return [`₹${Number(value).toLocaleString('en-IN')}`, name];
                    }
                    return [Number(value).toLocaleString('en-IN'), name];
                  }} />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar yAxisId="left" dataKey="totalRevenue" fill="hsl(var(--chart-1))" radius={4} name="Revenue" />
                  <Bar yAxisId="right" dataKey="totalOrders" fill="hsl(var(--chart-2))" radius={4} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">High-risk transaction flagged</p>
                  <p className="text-xs text-muted-foreground">Restaurant 'Shady Deals Inc.' - Investigate immediately.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">New restaurant 'Foodie Haven' approved</p>
                  <p className="text-xs text-muted-foreground">Onboarding completed successfully.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">User 'pricing_mgr' updated pricing rules</p>
                  <p className="text-xs text-muted-foreground">Awaiting checker approval for 'Summer Discounts'.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
