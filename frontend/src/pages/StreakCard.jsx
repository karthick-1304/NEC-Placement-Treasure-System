import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function StreakCard() {

  const [streak, setStreak] = useState({
    current: 0,
    longest: 0
  });

  useEffect(() => {

    const fetchStreak = async () => {

      try {

        const res = await axiosInstance.get("/stats/streak");

        setStreak(res.data.data);

      } catch (err) {
        console.error(err);
      }

    };

    fetchStreak();

  }, []);

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (

    <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6">

      {/* HEADER */}

      <div className="flex justify-between items-start mb-6">

        <div>

          <div className="flex items-center gap-2 text-zinc-400 text-sm">

            <span className="text-orange-400 text-lg">🔥</span>

            Current Streak

          </div>

          <div className="flex items-end gap-2 mt-2">

            <span className="text-4xl font-bold">
              {streak.current}
            </span>

            <span className="text-zinc-500 text-sm mb-1">
              days
            </span>

          </div>

        </div>

        <div className="text-right">

          <p className="text-zinc-500 text-sm">
            Longest
          </p>

          <p className="text-lg font-semibold">
            {streak.longest} days
          </p>

        </div>

      </div>

      {/* WEEK ROW */}

      <div className="flex justify-between text-xs text-zinc-500 mt-10">

        {days.map((day, i) => (

          <span
            key={i}
            className={i === 6 ? "text-amber-400" : ""}
          >
            {day}
          </span>

        ))}

      </div>

    </div>

  );

}