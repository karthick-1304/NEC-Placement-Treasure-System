import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function TrendChart({ data, view }) {

  // Decide which label to use on X-axis
  const dataKey = view === "weekly" ? "week" : "month";

  return (
    <div className="bg-[#0d1b36] p-6 rounded-lg shadow">

      {/* Chart Title */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        {view === "weekly"
          ? "Weekly Problem Solving Trend"
          : "Monthly Problem Solving Trend"}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#2d3a5f" />

          <XAxis
            dataKey={dataKey}
            stroke="#ccc"
          />

          <YAxis
            allowDecimals={false}
            stroke="#ccc"
          />

          <Tooltip />

          <Bar
            dataKey="solved"
            fill="#4f7cff"
            radius={[4, 4, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}