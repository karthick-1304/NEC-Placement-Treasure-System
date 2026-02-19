export default function DriveInfo({ drive }) {
  if (!drive) return null;
  return (
    <div className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 border border-primary-500/20 rounded-2xl p-5 mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-dark-400 text-sm">Package:</span>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
          {drive.ctc_package || 'Not Disclosed'}
        </span>
      </div>
      {drive.description && (
        <p className="text-dark-300 text-sm leading-relaxed">{drive.description}</p>
      )}
    </div>
  );
}