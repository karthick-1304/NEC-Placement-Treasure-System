import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function WeeklyGoalCard() {

  const [goal, setGoal] = useState(5);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyGoal = async () => {
    try {

      const res = await axiosInstance.get("/progress/weekly-goal");

      const data = res.data?.data;

      setGoal(data.goal);
      setCompleted(data.completed);

      setLoading(false);

    } catch (error) {
      console.error("Weekly goal fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyGoal();
  }, []);


  const increment = () => {
    setGoal((prev) => prev + 1);
  };

  const decrement = () => {
    if (goal > 1) {
      setGoal((prev) => prev - 1);
    }
  };


  const saveGoal = async () => {
    try {

      await axiosInstance.put("/progress/weekly-goal", {
        goal
      });

      alert("Weekly goal updated!");

      fetchWeeklyGoal();

    } catch (error) {
      console.error("Update goal error:", error);
    }
  };


  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl text-center">
        Loading weekly goal...
      </div>
    );
  }

  const percentage = Math.min((completed / goal) * 100, 100);

  return (
    <div className="bg-gray-800 p-6 rounded-xl">

      <h2 className="text-xl font-semibold mb-4">
        Weekly Goal
      </h2>

      {/* Incrementer */}
      <div className="flex items-center justify-center gap-4 mb-6">

        <button
          onClick={decrement}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          −
        </button>

        <span className="text-2xl font-bold">
          {goal}
        </span>

        <button
          onClick={increment}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          +
        </button>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4">

        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        />

      </div>

      <p className="mt-2 text-sm text-gray-300 text-center">
        {completed} / {goal} problems solved this week
      </p>

      {/* Save Button */}
      <div className="flex justify-center mt-4">

        <button
          onClick={saveGoal}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded"
        >
          Save Goal
        </button>

      </div>

    </div>
  );
}