import React from "react";

export default function Milestones({ milestones = {} }) {
    console.log("Milestones Data:", milestones);

  const milestoneList = [
    {
      key: "first_problem",
      label: "First Problem Solved",
      icon: "🏅"
    },
    {
      key: "ten_problems",
      label: "10 Problems Solved",
      icon: "🥈"
    },
    {
      key: "fifty_problems",
      label: "50 Problems Solved",
      icon: "🥉"
    },
    {
      key: "hundred_problems",
      label: "100 Problems Solved",
      icon: "🏆"
    }
  ];

  return (
    <div className="bg-[#0d1b36] p-6 rounded-lg shadow">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6 text-center">
        Milestones
      </h2>

      {/* Milestone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {milestoneList.map((item) => {

          const unlocked = milestones[item.key] === true;

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-4 rounded-lg transition
              ${
                unlocked
                  ? "bg-green-600/20 border border-green-500"
                  : "bg-gray-800 border border-gray-700 opacity-60"
              }`}
            >

              <div className="flex items-center gap-4">

                {/* Icon */}
                <span className="text-2xl">
                  {unlocked ? item.icon : "🔒"}
                </span>

                {/* Label */}
                <p className="font-medium">
                  {item.label}
                </p>

              </div>

              {/* Status */}
              <span
                className={`text-sm font-semibold
                ${unlocked ? "text-green-400" : "text-gray-400"}`}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </span>

            </div>
          );

        })}

      </div>

    </div>
  );
}