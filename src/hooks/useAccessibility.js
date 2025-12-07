import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Hook for managing keyboard navigation in lists
 */
export function useKeyboardNavigation(items, onSelect, options = {}) {
  const { enabled = true, loop = true, orientation = 'vertical' } = options;
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (!enabled || items.length === 0) return;

    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        setFocusedIndex(prev => {
          const next = prev + 1;
          if (next >= items.length) {
            return loop ? 0 : prev;
          }
          return next;
        });
        break;

      case prevKey:
        event.preventDefault();
        setFocusedIndex(prev => {
          const next = prev - 1;
          if (next < 0) {
            return loop ? items.length - 1 : 0;
          }
          return next;
        });
        break;

      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && onSelect) {
          onSelect(items[focusedIndex], focusedIndex);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setFocusedIndex(-1);
        break;

      default:
        break;
    }
  }, [enabled, items, focusedIndex, onSelect, loop, orientation]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return {
    containerRef,
    focusedIndex,
    setFocusedIndex,
  };
}

/**
 * Hook for managing focus trap within a modal
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when trap activates
    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for announcing content changes to screen readers
 */
export function useAnnounce() {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message, priority = 'polite') => {
    // Clear and re-set to ensure screen reader announces
    setAnnouncement('');
    requestAnimationFrame(() => {
      setAnnouncement(message);
    });
  }, []);

  const LiveRegion = useCallback(({ priority = 'polite' }) => (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  ), [announcement]);

  return { announce, LiveRegion };
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  const mainRef = useRef(null);
  const navRef = useRef(null);

  const skipToMain = useCallback(() => {
    mainRef.current?.focus();
  }, []);

  const skipToNav = useCallback(() => {
    navRef.current?.focus();
  }, []);

  return {
    mainRef,
    navRef,
    skipToMain,
    skipToNav,
  };
}

/**
 * Hook for managing reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for managing high contrast mode
 */
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (event) => {
      setIsHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

/**
 * Generate unique IDs for accessibility
 */
let idCounter = 0;
export function useId(prefix = 'id') {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = `${prefix}-${++idCounter}`;
  }
  return idRef.current;
}

/**
 * Get ARIA props for interactive elements
 */
export function getAriaProps({
  label,
  description,
  expanded,
  selected,
  controls,
  pressed,
  current,
  disabled,
  hasPopup,
  invalid,
  required,
  live,
}) {
  const props = {};

  if (label) props['aria-label'] = label;
  if (description) props['aria-describedby'] = description;
  if (expanded !== undefined) props['aria-expanded'] = expanded;
  if (selected !== undefined) props['aria-selected'] = selected;
  if (controls) props['aria-controls'] = controls;
  if (pressed !== undefined) props['aria-pressed'] = pressed;
  if (current) props['aria-current'] = current;
  if (disabled) props['aria-disabled'] = disabled;
  if (hasPopup) props['aria-haspopup'] = hasPopup;
  if (invalid !== undefined) props['aria-invalid'] = invalid;
  if (required !== undefined) props['aria-required'] = required;
  if (live) props['aria-live'] = live;

  return props;
}

export default {
  useKeyboardNavigation,
  useFocusTrap,
  useAnnounce,
  useSkipLinks,
  useReducedMotion,
  useHighContrastMode,
  useId,
  getAriaProps,
};
