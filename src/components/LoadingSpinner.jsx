import { useState, useEffect } from 'react';

/**
 * Smart loading spinner that detects slow requests (cold starts)
 * Shows a "waking up server" message after a delay
 */
export default function LoadingSpinner({
  message = 'Loading...',
  slowThreshold = 5000,  // Show "waking up" message after 5 seconds
  className = ''
}) {
  const [isSlow, setIsSlow] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    // Check every second if we've exceeded the slow threshold
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      setElapsed(Math.floor(elapsedTime / 1000));

      if (elapsedTime >= slowThreshold) {
        setIsSlow(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [slowThreshold]);

  return (
    <div className={`text-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>

      {isSlow ? (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Waking up server, this may take a minute...
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Free hosting services sleep after inactivity
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Waiting {elapsed}s...</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
