import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function ActivityHeatmap() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchHeatmap = async () => {

      const end = new Date();
      const start = new Date();

      // 365 days like GitHub
      start.setFullYear(end.getFullYear() - 1);

      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      try {

        const res = await axiosInstance.get(
          `/stats/heatmap?start=${startDate}&end=${endDate}`
        );

        const formatted = (res.data.data || []).map((item) => ({
          date: item.date,
          count: item.count || 0,
        }));

        setData(formatted);

      } catch (err) {
        console.error("Heatmap error:", err);
      }

    };

    fetchHeatmap();

  }, []);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  return (

    <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6 w-full">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-white">
          Contribution Activity
        </h2>

        <span className="text-sm text-zinc-500">
          Last 365 days
        </span>

      </div>

      {/* HEATMAP */}

      <div className="overflow-x-auto">

        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          gutterSize={3}
          showWeekdayLabels
          classForValue={(value) => {

            if (!value || value.count === 0) return "color-empty";
            if (value.count < 2) return "color-scale-1";
            if (value.count < 4) return "color-scale-2";
            if (value.count < 6) return "color-scale-3";

            return "color-scale-4";
          }}
        />

      </div>

      {/* LEGEND */}

      <div className="flex items-center justify-end mt-4 text-xs text-zinc-500 gap-2">

        <span>Less</span>

        <div className="flex gap-1">

          <span className="w-3 h-3 rounded-sm bg-[#1f1f25]"></span>
          <span className="w-3 h-3 rounded-sm bg-indigo-900"></span>
          <span className="w-3 h-3 rounded-sm bg-indigo-700"></span>
          <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
          <span className="w-3 h-3 rounded-sm bg-indigo-300"></span>

        </div>

        <span>More</span>

      </div>

      {/* STYLE */}

      <style>
{`

.react-calendar-heatmap {
  width: 100%;
}

/* cells */

.react-calendar-heatmap rect {
  width: 11px;
  height: 11px;
  rx: 2;
  ry: 2;
}

/* spacing between cells */

.react-calendar-heatmap .react-calendar-heatmap-day {
  shape-rendering: crispEdges;
}

/* weekday labels */

.react-calendar-heatmap text {
  fill: #6b7280;
  font-size: 9px;
}

/* empty cell */

.react-calendar-heatmap .color-empty {
  fill: #1f1f25;
}

/* activity levels */

.react-calendar-heatmap .color-scale-1 {
  fill: #312e81;
}

.react-calendar-heatmap .color-scale-2 {
  fill: #4338ca;
}

.react-calendar-heatmap .color-scale-3 {
  fill: #6366f1;
}

.react-calendar-heatmap .color-scale-4 {
  fill: #a5b4fc;
}

/* month labels */

.react-calendar-heatmap .react-calendar-heatmap-month-label {
  fill: #6b7280;
  font-size: 10px;
}

/* tooltip hover effect */

.react-calendar-heatmap rect:hover {
  stroke: #fff;
  stroke-width: 1px;
}

`}
</style>

    </div>

  );

}