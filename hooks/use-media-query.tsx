import { useState, useEffect } from "react";

/**
 * Custom hook that checks if the given media query matches
 * @param {string} query - CSS media query string (e.g. "(min-width: 768px)")
 * @returns {boolean} - True if the media query matches, false otherwise
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize with the match state on first render
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (to avoid SSR issues)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Exit early if window is not available
    if (typeof window === "undefined") return undefined;

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Define event listener
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // Add event listener (using modern approach only)
    mediaQueryList.addEventListener("change", listener);

    // Cleanup function for useEffect
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]); // Re-run effect if query changes

  return matches;
};
