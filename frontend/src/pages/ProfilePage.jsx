import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import DifficultyStats from "./DifficultyStats.jsx";
import ActivityHeatmap from "./ActivityHeatmap.jsx";
import StreakCard from "./StreakCard.jsx";
import { Link } from "react-router-dom";

export default function ProfilePage() {

  const [profile, setProfile] = useState(null);
  const [recentSolves, setRecentSolves] = useState([]);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axiosInstance.get("/profile/me");

        setProfile(res.data.data.profile);
        setRecentSolves(res.data.data.recent_solves);

      } catch (err) {
        console.error(err);
      }

    };

    fetchProfile();

  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    );
  }

  const solved = profile.programs_solved || 0;

  let level = "Beginner";
  if (solved >= 50) level = "Intermediate";
  if (solved >= 150) level = "Advanced";

  return (

    <div className="min-h-screen bg-[#05060f] text-white">

      {/* grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(#1f1f1f_1px,transparent_1px),linear-gradient(90deg,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">

        {/* PROFILE HEADER */}

        <div className="flex items-center gap-6 mb-10">

          <div className="w-24 h-24 rounded-full bg-indigo-600/30 flex items-center justify-center text-4xl font-bold shadow-[0_0_40px_rgba(99,102,241,0.5)]">
            {profile.full_name?.charAt(0)}
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              {profile.full_name}
            </h1>

            <div className="flex gap-4 text-sm text-zinc-400 mt-2">

              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Online
              </span>

              <span>{profile.email}</span>

              <span className="bg-zinc-800 px-3 py-1 rounded-lg text-xs">
                {profile.reg_no}
              </span>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard
            label="Problems Solved"
            value={profile.programs_solved}
          />

          <StatCard
            label="Total Score"
            value={profile.total_score}
          />

          <StatCard
            label="Global Rank"
            value={`#${profile.global_rank}`}
          />

        </div>

        {/* STREAK + LEVEL */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <StreakCard />

          <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6">

            <div className="flex justify-between mb-4 text-sm text-zinc-400">
              <span>Current Level</span>
              <span>Next Level</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              {level}
            </h2>

            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>{solved} solved</span>
              <span>150 needed</span>
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${Math.min((solved / 150) * 100, 100)}%` }}
              />
            </div>

          </div>

        </div>

        {/* HEATMAP */}

        <div className="mb-10">
          <ActivityHeatmap />
        </div>

        {/* DIFFICULTY + RECENT */}

        <div className="grid md:grid-cols-3 gap-6">

          <DifficultyStats />

          {/* RECENT SOLVES */}

          <div className="md:col-span-2 bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6">

            <div className="flex justify-between mb-6">

              <h2 className="text-lg font-semibold">
                Recent Solves
              </h2>

              <Link
                to="/solved"
                className="text-indigo-400 text-sm hover:text-indigo-300"
              >
                View all →
              </Link>

            </div>

            <div className="space-y-4">

              {recentSolves.map((p) => (

                <div
                  key={p.prog_id}
                  className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800"
                >

                  <div>

                    <p className="font-medium">
                      {p.title}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {new Date(p.solved_at).toLocaleDateString()}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      p.difficulty === "Easy"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : p.difficulty === "Medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {p.difficulty}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


function StatCard({ label, value }) {

  return (

    <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">

      <div>

        <p className="text-zinc-400 text-sm">
          {label}
        </p>

        <p className="text-2xl font-bold mt-1">
          {value}
        </p>

      </div>

      <div className="w-10 h-10 bg-black rounded-lg border border-zinc-800"></div>

    </div>

  );

}