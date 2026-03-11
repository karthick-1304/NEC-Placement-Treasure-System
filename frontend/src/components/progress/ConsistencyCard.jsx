import React from "react";

export default function ConsistencyCard({ score }) {

  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="bg-[#0d1b36] p-6 rounded-lg shadow text-center">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        Consistency Score
      </h2>

      {/* Score Value */}
      <p className="text-3xl font-bold mb-4">
        {score}%
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`${getColor()} h-4`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Label */}
      <p className="mt-3 text-gray-400 text-sm">
        {getLabel()}
      </p>

      {/* Explanation */}
      <p className="text-xs text-gray-500 mt-2">
        Based on active coding days in the last 30 days
      </p>

    </div>
  );
}