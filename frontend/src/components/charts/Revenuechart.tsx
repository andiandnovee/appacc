import { FC, ReactNode, ReactElement } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "../ui/Card";
import styles from "./Revenuechart.module.css";

interface RevenueChartProps {
  active?: any
  payload?: any
  label?: any
}


const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 8000 },
];

// ── Warna dari tokens — ambil via getComputedStyle ──────────
// Ini cara yang benar untuk pakai CSS variable di dalam prop JS/SVG
function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// ── Custom Tooltip — pakai tokens, bukan style default recharts ──
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart() {
  // Ambil warna dari tokens saat render
  const primaryColor = getCssVar("--color-primary-500") || "#5470ef";
  const gridColor = getCssVar("--border-subtle") || "#e2e8f0";
  const textColor = getCssVar("--text-tertiary") || "#94a3b8";

  return (
    <Card variant="outlined">
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Revenue Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
          >
            {/* Gradient — pakai primary color dari tokens */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false} /* hanya garis horizontal — lebih clean */
            />

            <XAxis
              dataKey="name"
              tick={{ fill: textColor, fontSize: 12, fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: textColor, fontSize: 12, fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: gridColor, strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke={primaryColor}
              strokeWidth={2.5}
              dot={{ fill: primaryColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: primaryColor, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
