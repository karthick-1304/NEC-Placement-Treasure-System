import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export default function ProfilePage() {

  const [profile, setProfile] = useState(null);
  const [recentSolves, setRecentSolves] = useState([]);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axiosInstance.get("/profile/me");

        console.log("PROFILE RESPONSE:", res.data);

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
  const totalScore = profile.total_score || 0;

  let level = "Beginner";
  if (solved >= 50) level = "Intermediate";
  if (solved >= 150) level = "Advanced";

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10 text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg mb-8 flex items-center gap-4">

        <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold">
          {profile.full_name?.charAt(0)}
        </div>

        <div>
          <h1 className="text-xl font-bold">{profile.full_name}</h1>
          <p className="text-gray-200 text-sm">{profile.email}</p>
          <p className="text-gray-300 text-sm">Reg No: {profile.reg_no}</p>
        </div>

      </div>


      {/* PERFORMANCE */}
      <Section title="Performance">

        <ProfileItem label="Problems Solved" value={profile.programs_solved} />

        <ProfileItem label="Total Score" value={profile.total_score} />

        <ProfileItem label="Global Rank" value={profile.global_rank} />

      </Section>


      {/* SKILL LEVEL */}
      <Section title="Skill Level">

        <div className="bg-dark-800 p-6 rounded-lg text-center shadow">
          <p className="text-sm text-gray-400">Current Level</p>
          <p className="text-2xl font-bold mt-1">{level}</p>
        </div>

      </Section>


      {/* RECENT SOLVES */}
      <Section title="Recent Solved Problems">

        {recentSolves.length === 0 ? (
          <p>No problems solved yet</p>
        ) : (
          recentSolves.map((prob) => (

            <div
              key={prob.prog_id}
              className="bg-dark-800 p-4 rounded-lg shadow flex justify-between"
            >

              <p>{prob.title}</p>

              <span className="text-green-400 text-sm">
                {prob.difficulty}
              </span>

            </div>

          ))
        )}

      </Section>

    </div>
  );
}


function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}


function ProfileItem({ label, value }) {
  return (
    <div className="bg-dark-800 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}