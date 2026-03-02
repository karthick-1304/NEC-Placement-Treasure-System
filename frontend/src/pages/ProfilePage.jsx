import useAuth from "../hooks/useAuth.js";

export default function ProfilePage() {
  const { user, profile, medals } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-dark-900 rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        <ProfileItem label="Full Name" value={user.full_name} />
        <ProfileItem label="Email" value={user.email} />
        <ProfileItem label="Register Number" value={profile?.reg_no} />
        <ProfileItem label="Department" value={profile?.dept_name || profile?.dept_code} />
        <ProfileItem label="Batch Year" value={profile?.batch_year} />
        <ProfileItem label="Total Score" value={medals?.total_score} />
        <ProfileItem label="Programs Solved" value={medals?.programs_solved} />
        <ProfileItem label="Global Rank" value={medals?.global_rank} />

      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="bg-dark-800 p-4 rounded-lg">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium">{value ?? "-"}</p>
    </div>
  );
}