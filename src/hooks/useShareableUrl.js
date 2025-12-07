import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

/**
 * Hook for creating and parsing shareable URLs with comparison state
 */
export function useShareableUrl() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  /**
   * Generate a shareable URL for country comparison
   */
  const generateComparisonUrl = useCallback((countryCodes, options = {}) => {
    const params = new URLSearchParams();

    // Add country codes
    if (countryCodes && countryCodes.length > 0) {
      params.set('countries', countryCodes.join(','));
    }

    // Add optional filters
    if (options.tab) {
      params.set('tab', options.tab);
    }
    if (options.category) {
      params.set('category', options.category);
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?${params.toString()}`;

    return url;
  }, []);

  /**
   * Generate a shareable URL for engine comparison
   */
  const generateEngineComparisonUrl = useCallback((engineIds, options = {}) => {
    const params = new URLSearchParams();

    if (engineIds && engineIds.length > 0) {
      params.set('engines', engineIds.join(','));
    }

    if (options.chartType) {
      params.set('chart', options.chartType);
    }

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
  }, []);

  /**
   * Parse country codes from URL
   */
  const parseCountryCodes = useMemo(() => {
    const countriesParam = searchParams.get('countries');
    return countriesParam ? countriesParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  /**
   * Parse engine IDs from URL
   */
  const parseEngineIds = useMemo(() => {
    const enginesParam = searchParams.get('engines');
    return enginesParam ? enginesParam.split(',').filter(Boolean).map(Number) : [];
  }, [searchParams]);

  /**
   * Parse tab selection from URL
   */
  const parseTab = useMemo(() => {
    return searchParams.get('tab') || null;
  }, [searchParams]);

  /**
   * Parse category filter from URL
   */
  const parseCategory = useMemo(() => {
    return searchParams.get('category') || null;
  }, [searchParams]);

  /**
   * Update URL parameters without navigation
   */
  const updateUrlParams = useCallback((params, replace = true) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams, { replace });
  }, [searchParams, setSearchParams]);

  /**
   * Copy URL to clipboard
   */
  const copyUrlToClipboard = useCallback(async (url = window.location.href) => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (e) {
        console.error('Failed to copy URL:', e);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }, []);

  /**
   * Generate a full shareable link and copy it
   */
  const shareComparison = useCallback(async (countryCodes, options = {}) => {
    const url = generateComparisonUrl(countryCodes, options);
    const success = await copyUrlToClipboard(url);
    return { success, url };
  }, [generateComparisonUrl, copyUrlToClipboard]);

  return {
    // URL generation
    generateComparisonUrl,
    generateEngineComparisonUrl,
    copyUrlToClipboard,
    shareComparison,

    // URL parsing
    parseCountryCodes,
    parseEngineIds,
    parseTab,
    parseCategory,

    // URL manipulation
    updateUrlParams,
    searchParams,
    location,
  };
}

export default useShareableUrl;
