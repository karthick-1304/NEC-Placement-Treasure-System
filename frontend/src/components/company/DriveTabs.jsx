const TABS = [
  { key: 'feedbacks', label: 'Interview Feedbacks', icon: '💬' },
  { key: 'programs',  label: 'Asked Coding Questions', icon: '💻' },
];

export default function DriveTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-dark-900 border border-dark-700 rounded-xl p-1 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
            ${active === tab.key
              ? 'bg-primary-600 text-white shadow-glow-blue'
              : 'text-dark-400 hover:text-white hover:bg-dark-800'}`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}