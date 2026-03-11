import React from "react";

export default function TrendToggle({ view, setView }) {
  return (
    <div className="flex justify-center gap-4">

      {/* Weekly Button */}
      <button
        onClick={() => setView("weekly")}
        className={`px-5 py-2 rounded-lg font-semibold transition 
          ${
            view === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
      >
        Weekly
      </button>

      {/* Monthly Button */}
      <button
        onClick={() => setView("monthly")}
        className={`px-5 py-2 rounded-lg font-semibold transition 
          ${
            view === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
      >
        Monthly
      </button>

    </div>
  );
}