export default function YearSelector({ years, selectedDriveId, onSelect }) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <span className="text-dark-400 text-sm font-medium shrink-0">Recruitment Year:</span>
      <div className="flex flex-wrap gap-2">
        {years.map((y) => (
          <button
            key={y.drive_id}
            onClick={() => onSelect(y.drive_id)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${selectedDriveId === y.drive_id
                ? 'bg-primary-600 text-white shadow-glow-blue'
                : 'bg-dark-800 border border-dark-600 text-dark-300 hover:border-primary-500/50 hover:text-white'}`}
          >
            {y.batch_year}
          </button>
        ))}
      </div>
    </div>
  );
}