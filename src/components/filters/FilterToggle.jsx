/**
 * Filter toggle button component with optional count badge
 */
export default function FilterToggle({ label, active, onClick, count, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
          : active
          ? 'bg-indigo-500/90 text-white border-indigo-400/50 shadow-sm'
          : 'bg-white/60 dark:bg-white/[0.08] text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-white/[0.12] hover:border-indigo-400/50 dark:hover:border-indigo-400/30'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20' : 'bg-gray-500/10 dark:bg-white/10'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
