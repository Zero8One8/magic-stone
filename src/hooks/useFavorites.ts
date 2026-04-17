import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "crystal-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggle = useCallback((name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }, []);

  const isFavorite = useCallback((name: string) => favorites.includes(name), [favorites]);

  return { favorites, toggle, isFavorite, count: favorites.length };
};
