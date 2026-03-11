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
        console.error("Profile fetch error:", err);
      }

    };

    fetchProfile();

  }, []);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading profile...
      </div>
    );
  }

  const solved = profile.programs_solved || 0;

  let level = "Beginner";
  if (solved >= 50) level = "Intermediate";
  if (solved >= 150) level = "Advanced";

  return (

    <div className="max-w-6xl mx-auto px-6 py-10 text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-xl shadow-xl mb-10 flex items-center gap-6">

        <div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center text-3xl font-bold">
          {profile.full_name?.charAt(0)}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="text-gray-200 text-sm">{profile.email}</p>
          <p className="text-gray-300 text-sm">Reg No: {profile.reg_no}</p>
        </div>

      </div>

      {/* PERFORMANCE */}
      <div className="mb-10">

        <h2 className="text-xl font-semibold mb-4">Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <ProfileCard
            label="Problems Solved"
            value={profile.programs_solved}
          />

          <ProfileCard
            label="Total Score"
            value={profile.total_score}
          />

          <ProfileCard
            label="Global Rank"
            value={profile.global_rank}
          />

        </div>

      </div>

      {/* STREAK */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Coding Streak
        </h2>

        <div className="max-w-sm">
          <StreakCard />
        </div>
      </div>

      {/* ACTIVITY HEATMAP */}
      <div className="mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Coding Activity
        </h2>

       <div className="bg-dark-800 p-6 rounded-xl shadow-lg overflow-x-auto">
           <ActivityHeatmap />
       </div>

      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Difficulty Stats
          </h2>

          <DifficultyStats />
        </div>

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Skill Level
          </h2>

          <div className="bg-dark-800 p-6 rounded-xl text-center shadow-lg">

            <p className="text-sm text-gray-400">
              Current Level
            </p>

            <p className="text-3xl font-bold mt-2">
              {level}
            </p>

          </div>

        </div>

      </div>

      {/* RECENT SOLVES */}
      <div className="mb-10">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Recent Solved Problems
          </h2>

          <Link
            to="/solved"
            className="text-indigo-400 text-sm hover:underline"
          >
            View Full History →
          </Link>

        </div>

        {recentSolves.length === 0 ? (

          <p className="text-gray-400">
            No problems solved yet
          </p>

        ) : (

          <div className="space-y-3">

            {recentSolves.map((prob) => (

              <div
                key={prob.prog_id}
                className="bg-dark-800 p-4 rounded-lg shadow flex justify-between items-center hover:bg-dark-700 transition"
              >

                <div>

                  <p className="font-medium">
                    {prob.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    Solved on {new Date(prob.solved_at).toLocaleDateString()}
                  </p>

                </div>

                <span className="text-green-400 text-sm font-medium">
                  {prob.difficulty}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}


function ProfileCard({ label, value }) {

  return (

    <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>

    </div>

  );

}