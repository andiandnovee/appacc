import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 8000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Revenue Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#colorRevenue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
