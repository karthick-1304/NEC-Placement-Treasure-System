const LANG_LABELS = { c: 'C', cpp: 'C++', java: 'Java', python: 'Python' };
const LANG_COLORS = {
  c:      'text-blue-400',
  cpp:    'text-cyan-400',
  java:   'text-orange-400',
  python: 'text-yellow-400',
};

export default function LangSelector({ langTemplates, selectedLang, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-dark-500 text-xs font-medium shrink-0">Language:</span>
      <div className="flex gap-1 flex-wrap">
        {langTemplates.map((lt) => (
          <button
            key={lt.lang_slug}
            onClick={() => onChange(lt.lang_slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
              ${selectedLang === lt.lang_slug
                ? 'bg-dark-700 border-primary-500 text-white shadow-glow-blue'
                : 'bg-dark-800 border-dark-600 text-dark-400 hover:border-dark-500 hover:text-white'}`}
          >
            <span className={LANG_COLORS[lt.lang_slug] || 'text-dark-300'}>◆</span>
            {LANG_LABELS[lt.lang_slug] || lt.lang_slug}
            {lt.version_label && (
              <span className="text-dark-600 text-xs hidden sm:inline">({lt.version_label})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}