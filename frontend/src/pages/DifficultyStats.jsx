import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export default function DifficultyStats() {

  const [stats, setStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await axiosInstance.get("/stats/difficulty");
        setStats(res.data.data);

      } catch (err) {
        console.error(err);
      }

    };

    fetchStats();

  }, []);

  const total = stats.easy + stats.medium + stats.hard;

  const easyPercent = total ? (stats.easy / total) * 100 : 0;
  const mediumPercent = total ? (stats.medium / total) * 100 : 0;
  const hardPercent = total ? (stats.hard / total) * 100 : 0;

  return (

    <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6">

      <h2 className="text-lg font-semibold text-white mb-8">
        Difficulty
      </h2>

      <div className="flex items-center justify-between">

        {/* DONUT CHART */}

        <div className="relative w-36 h-36">

          <svg viewBox="0 0 36 36" className="rotate-[-90deg]">

            {/* background */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />

            {/* easy */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray={`${easyPercent} ${100 - easyPercent}`}
            />

            {/* medium */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray={`${mediumPercent} ${100 - mediumPercent}`}
              strokeDashoffset={-easyPercent}
            />

            {/* hard */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray={`${hardPercent} ${100 - hardPercent}`}
              strokeDashoffset={-(easyPercent + mediumPercent)}
            />

          </svg>

          {/* center text */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-2xl font-bold">
              {total}
            </span>

            <span className="text-xs text-zinc-500">
              TOTAL
            </span>

          </div>

        </div>

        {/* STATS */}

        <div className="space-y-4 text-sm">

          <Row
            color="bg-emerald-500"
            label="Easy"
            value={stats.easy}
          />

          <Row
            color="bg-amber-500"
            label="Medium"
            value={stats.medium}
          />

          <Row
            color="bg-rose-500"
            label="Hard"
            value={stats.hard}
          />

        </div>

      </div>

    </div>

  );

}


function Row({ color, label, value }) {

  return (

    <div className="flex items-center justify-between gap-6">

      <div className="flex items-center gap-2 text-zinc-400">

        <span className={`w-3 h-3 rounded-full ${color}`}></span>

        {label}

      </div>

      <span className="text-white font-medium">
        {value}
      </span>

    </div>

  );

}