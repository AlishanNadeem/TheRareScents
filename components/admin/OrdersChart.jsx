"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OrdersChart({ data }) {
  const total = data.reduce((sum, row) => sum + row.count, 0);

  if (!total) {
    return (
      <p className="mt-6 text-sm text-neutral-500">
        No orders in the last 30 days yet.
      </p>
    );
  }

  return (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A24B" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#C9A24B" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#8C8C8C" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#8C8C8C" }}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(10,10,10,0.1)",
              fontSize: 12,
            }}
            formatter={(value) => [value, "Orders"]}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#C9A24B"
            strokeWidth={2}
            fill="url(#ordersFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
