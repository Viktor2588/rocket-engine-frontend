import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'space-dashboard-favorites';

/**
 * Load favorites from localStorage
 */
function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading favorites:', e);
  }
  return {
    countries: [],
    engines: [],
    vehicles: [],
    missions: [],
    satellites: [],
    launchSites: [],
  };
}

/**
 * Save favorites to localStorage
 */
function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
}

/**
 * Hook for managing favorites
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  // Save to localStorage when favorites change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Check if item is favorited
  const isFavorite = useCallback((type, id) => {
    return favorites[type]?.includes(id) || false;
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((type, id) => {
    setFavorites(prev => {
      const typeArray = prev[type] || [];
      const isCurrentlyFavorite = typeArray.includes(id);

      return {
        ...prev,
        [type]: isCurrentlyFavorite
          ? typeArray.filter(fId => fId !== id)
          : [...typeArray, id],
      };
    });
  }, []);

  // Add favorite
  const addFavorite = useCallback((type, id) => {
    setFavorites(prev => {
      const typeArray = prev[type] || [];
      if (typeArray.includes(id)) return prev;

      return {
        ...prev,
        [type]: [...typeArray, id],
      };
    });
  }, []);

  // Remove favorite
  const removeFavorite = useCallback((type, id) => {
    setFavorites(prev => {
      const typeArray = prev[type] || [];
      return {
        ...prev,
        [type]: typeArray.filter(fId => fId !== id),
      };
    });
  }, []);

  // Clear all favorites of a type
  const clearType = useCallback((type) => {
    setFavorites(prev => ({
      ...prev,
      [type]: [],
    }));
  }, []);

  // Clear all favorites
  const clearAll = useCallback(() => {
    setFavorites({
      countries: [],
      engines: [],
      vehicles: [],
      missions: [],
      satellites: [],
      launchSites: [],
    });
  }, []);

  // Get count of favorites
  const getFavoriteCount = useCallback((type) => {
    if (type) {
      return favorites[type]?.length || 0;
    }
    return Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
  }, [favorites]);

  // Get all favorite IDs for a type
  const getFavoriteIds = useCallback((type) => {
    return favorites[type] || [];
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearType,
    clearAll,
    getFavoriteCount,
    getFavoriteIds,
  };
}

/**
 * FavoriteButton Component
 */
export function FavoriteButton({ type, id, size = 'md', showLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(type, id);

  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(type, id);
      }}
      className={`rounded-full transition hover:scale-110 ${sizeClasses[size]} ${
        favorited
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-yellow-500'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )}
      {showLabel && (
        <span className="ml-1">{favorited ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
}

export default useFavorites;
