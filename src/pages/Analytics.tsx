import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { generateInitialTransactions, generateNewTransaction } from '@/lib/transaction-engine';
import { computeTrendData, computeGeoData, computeScoreDistribution } from '@/lib/analytics-data';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';

const trendConfig = {
  total: { label: 'Total', color: 'hsl(217 91% 60%)' },
  suspicious: { label: 'Suspicious', color: 'hsl(0 72% 51%)' },
  warning: { label: 'Warning', color: 'hsl(45 93% 47%)' },
};

const geoConfig = {
  count: { label: 'Transactions', color: 'hsl(217 91% 60%)' },
  suspicious: { label: 'Suspicious', color: 'hsl(0 72% 51%)' },
};

const scoreConfig = {
  count: { label: 'Transactions', color: 'hsl(217 91% 60%)' },
};

const scoreBucketColors = [
  'hsl(142 71% 45%)',
  'hsl(142 71% 45%)',
  'hsl(45 93% 47%)',
  'hsl(25 95% 53%)',
  'hsl(0 72% 51%)',
];

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    generateInitialTransactions(40)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateNewTransaction();
      setTransactions(prev => [newTxn, ...prev].slice(0, 80));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const trendData = computeTrendData(transactions);
  const geoData = computeGeoData(transactions);
  const scoreData = computeScoreDistribution(transactions);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-6 space-y-4 min-w-0">
        <div className="mb-2">
          <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
          <p className="text-xs text-muted-foreground">
            Fraud trends, geographic distribution & score analysis
          </p>
        </div>

        {/* Fraud Trends */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Fraud Trends (Last 12 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[280px] w-full">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
                <XAxis dataKey="hour" stroke="hsl(240 4% 46%)" fontSize={11} />
                <YAxis stroke="hsl(240 4% 46%)" fontSize={11} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(217 91% 60%)"
                  fill="hsla(217, 91%, 60%, 0.15)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="warning"
                  stroke="hsl(45 93% 47%)"
                  fill="hsla(45, 93%, 47%, 0.1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  stroke="hsl(0 72% 51%)"
                  fill="hsla(0, 72%, 51%, 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Geographic Distribution */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={geoConfig} className="h-[260px] w-full">
                <BarChart data={geoData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
                  <XAxis dataKey="country" stroke="hsl(240 4% 46%)" fontSize={11} />
                  <YAxis stroke="hsl(240 4% 46%)" fontSize={11} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="suspicious" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Fraud Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={scoreConfig} className="h-[260px] w-full">
                <BarChart data={scoreData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
                  <XAxis dataKey="range" stroke="hsl(240 4% 46%)" fontSize={11} />
                  <YAxis stroke="hsl(240 4% 46%)" fontSize={11} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {scoreData.map((_, index) => (
                      <Cell key={index} fill={scoreBucketColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
