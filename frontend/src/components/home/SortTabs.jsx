const TABS = [
  { key: 'alpha',            label: 'A–Z',              icon: '🔤' },
  { key: 'most_recruitments',label: 'Most Visits',       icon: '🏢' },
  { key: 'last_visited',     label: 'Recently Visited',  icon: '🕐' },
];

export default function SortTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-dark-900 border border-dark-700 rounded-xl p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${active === tab.key
              ? 'bg-primary-600 text-white shadow-glow-blue'
              : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}
        >
          <span>{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}