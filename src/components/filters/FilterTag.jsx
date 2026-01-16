import { Close } from '@mui/icons-material';

/**
 * Color classes for filter tags
 */
const COLOR_CLASSES = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  green: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
  red: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
};

/**
 * Removable filter tag component
 */
export default function FilterTag({ label, onRemove, color = 'indigo' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium border ${COLOR_CLASSES[color] || COLOR_CLASSES.indigo}`}>
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <Close style={{ fontSize: '0.875rem' }} />
      </button>
    </span>
  );
}

export { COLOR_CLASSES };
