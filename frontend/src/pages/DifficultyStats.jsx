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
        console.error("Stats error", err);
      }
    };

    fetchStats();

  }, []);

  return (
    <div className="bg-dark-800 p-6 rounded-lg shadow">

      <h3 className="text-lg font-semibold mb-4">
        Difficulty Breakdown
      </h3>

      <Stat label="Easy" value={stats.easy} color="bg-green-500" />
      <Stat label="Medium" value={stats.medium} color="bg-yellow-500" />
      <Stat label="Hard" value={stats.hard} color="bg-red-500" />

    </div>
  );
}


function Stat({ label, value, color }) {

  return (
    <div className="mb-4">

      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full bg-gray-700 rounded h-2">

        <div
          className={`${color} h-2 rounded`}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />

      </div>

    </div>
  );
}