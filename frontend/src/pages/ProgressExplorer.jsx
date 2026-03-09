import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProgressExplorer() {
  const navigate = useNavigate();
  const { medals } = useAuth();

  const totalPrograms = medals?.total_programs ?? 0;
  const programsSolved = medals?.programs_solved ?? 0;

  // Global Rank only if at least 1 problem solved
  const globalRank = programsSolved < 1 ? "-" : medals?.global_rank ?? "-";

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10 text-white">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-center mb-2">Progress Explorer</h1>
        <p className="text-center text-gray-400 text-sm">
          Track your coding journey and stats
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Programs" value={totalPrograms} />
        <StatCard label="Programs Solved" value={programsSolved} />
        <StatCard label="Global Rank" value={globalRank} />
      </div>

      {/* Empty State */}
      {programsSolved === 0 && (
        <div className="bg-gradient-to-br from-[#0b1426] to-[#1a2a4a] p-10 rounded-xl text-center shadow-lg">
          <p className="text-xl text-gray-300 mb-4">
            You haven’t solved any programs yet!
          </p>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-3 rounded-lg bg-[#16224c] hover:bg-[#1c2e65] transition font-semibold"
          >
            Explore Programs
          </button>
        </div>
      )}

    </div>
  );
}

// Stat Card
function StatCard({ label, value }) {
  return (
    <div className="bg-[#0d1b36] p-6 rounded-lg shadow flex flex-col items-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-2">{value ?? "-"}</p>
    </div>
  );
}