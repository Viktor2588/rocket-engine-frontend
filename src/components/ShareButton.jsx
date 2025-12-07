import { useState, useCallback } from 'react';

/**
 * Share button with copy-to-clipboard functionality
 */
export default function ShareButton({
  url,
  onShare,
  title = 'Share',
  className = '',
  size = 'md',
  variant = 'primary',
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
  };

  const handleShare = useCallback(async () => {
    try {
      // Use Web Share API if available and on mobile
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        await navigator.share({
          title: 'Space Capabilities Comparison',
          url: url || window.location.href,
        });
        return;
      }

      // Otherwise, copy to clipboard
      let shareUrl = url;
      if (onShare) {
        const result = await onShare();
        if (result?.url) {
          shareUrl = result.url;
        }
      }

      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setError(false);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }, [url, onShare]);

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 rounded-lg transition
        ${sizeClasses[size]}
        ${copied
          ? 'bg-green-600 text-white'
          : error
            ? 'bg-red-600 text-white'
            : variantClasses[variant]
        }
        ${className}
      `}
      title={copied ? 'Copied!' : 'Copy shareable link'}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : error ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Failed</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{title}</span>
        </>
      )}
    </button>
  );
}

/**
 * Compact icon-only share button
 */
export function ShareIconButton({ url, onShare, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      let shareUrl = url;
      if (onShare) {
        const result = await onShare();
        if (result?.url) {
          shareUrl = result.url;
        }
      }

      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  }, [url, onShare]);

  return (
    <button
      onClick={handleShare}
      className={`
        p-2 rounded-lg transition
        ${copied
          ? 'bg-green-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
        }
        ${className}
      `}
      title={copied ? 'Link copied!' : 'Copy shareable link'}
      aria-label={copied ? 'Link copied' : 'Share'}
    >
      {copied ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}
