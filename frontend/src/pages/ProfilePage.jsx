import useAuth from "../hooks/useAuth.js";

// Sample data for streak and recent problems (replace with real data later)
const sampleRecentProblems = [
  { title: "Two Sum", status: "Solved" },
  { title: "Reverse Linked List", status: "Solved" },
  { title: "Valid Parentheses", status: "Solved" },
  { title: "Longest Substring", status: "Attempted" },
  { title: "Binary Search", status: "Solved" },
];

// Sample streak: array of last 14 days (true = active, false = inactive)
const sampleStreak = [false, true, true, false, true, true, true, true, false, true, true, true, false, true];

export default function ProfilePage() {
  const { user, medals } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Loading profile...
      </div>
    );
  }

  const solved = medals?.programs_solved ?? 0;
  const totalScore = medals?.total_score ?? 0;

  // For now: attempted = solved (since attempts not tracked yet)
  const attempted = solved;

  const accuracy =
    attempted > 0 ? Math.round((solved / attempted) * 100) : 0;

  let level = "Beginner";
  if (solved >= 50) level = "Intermediate";
  if (solved >= 150) level = "Advanced";

  const codingStreakDays = sampleStreak.filter((day) => day).length;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg mb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold">
          {user.full_name?.charAt(0)}
        </div>

        <div>
          <h1 className="text-xl font-bold">{user.full_name}</h1>
          <p className="text-gray-200 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Performance */}
      <Section title="Performance">
        <ProfileItem label="Problems Solved" value={solved} />
        <ProfileItem label="Total Score" value={totalScore} />
        <ProfileItem label="Accuracy" value={`${accuracy}%`} />
      </Section>

      {/* Skill Level */}
      <Section title="Skill Level">
        <div className="col-span-1 md:col-span-3">
          <div className="bg-dark-800 p-6 rounded-lg text-center shadow">
            <p className="text-sm text-gray-400">Current Level</p>
            <p className="text-2xl font-bold mt-1">{level}</p>
          </div>
        </div>
      </Section>

      {/* Learning Insights */}
      <Section title="Learning Insights">
        <InsightItem label="🔥 Coding Streak" value={`${codingStreakDays} days`} />
        <InsightItem label="💪 Strongest Topic" value="Arrays" />
        <InsightItem label="🧠 Needs Practice" value="Recursion" />
      </Section>


      {/* Recent Solved Problems */}
      <Section title="Recent Solved Problems">
        {sampleRecentProblems.map((prob, i) => (
          <div
            key={i}
            className={`bg-dark-800 p-4 rounded-lg shadow flex justify-between items-center`}
          >
            <p>{prob.title}</p>
            <p
              className={`text-sm font-semibold ${
                prob.status === "Solved" ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {prob.status}
            </p>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="bg-dark-800 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium">{value ?? "-"}</p>
    </div>
  );
}

function InsightItem({ label, value }) {
  return (
    <div className="bg-dark-800 p-4 rounded-lg shadow">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}