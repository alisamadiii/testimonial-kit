"use client";

import * as React from "react";
import { Area, AreaChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Analytics } from "@/db/schema";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Testimonials",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProjectChart({
  analytics,
}: {
  analytics: Analytics["dateTestimonials"];
}) {
  if (!analytics) return null;
  console.log(analytics);

  const data = analytics.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[60px] w-3/5">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillAnalytics" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-analytics)"
              stopOpacity={1}
            />
            <stop
              offset="95%"
              stopColor="var(--color-analytics)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="linear"
          fill="url(#fillAnalytics)"
          stroke="var(--color-analytics)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
