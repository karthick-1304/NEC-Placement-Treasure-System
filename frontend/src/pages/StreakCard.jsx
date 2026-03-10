import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function StreakCard() {

  const [streak, setStreak] = useState(null);

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

  if (!streak) return null;

  return (

    <div className="bg-dark-800 p-6 rounded-lg shadow text-center">

      <p className="text-sm text-gray-400 mb-1">
        Coding Streak
      </p>

      <p className="text-xl font-bold">
        🔥 {streak.currentStreak} Days
      </p>

      <p className="text-sm text-gray-400 mt-2">
        🏆 Longest: {streak.longestStreak} Days
      </p>

    </div>

  );

}