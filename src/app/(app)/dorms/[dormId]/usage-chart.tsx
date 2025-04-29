"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { HourlyAverage } from "~/lib/laundry-util";

const chartConfig = {
  average_usage: {
    label: "Usage",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function UsageChart({ chartData }: { chartData: HourlyAverage[] }) {
  return (
    <Card className="min-h-32 w-80">
      <CardContent>
        <ChartContainer config={chartConfig} className="h-28 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={3}
              axisLine={false}
            />
            <Bar dataKey="average_usage" fill="#60a5fa" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
