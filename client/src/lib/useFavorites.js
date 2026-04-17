import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (postId) => favorites.some((p) => p._id === postId);

  const toggleFavorite = (post) => {
    setFavorites((prev) =>
      prev.some((p) => p._id === post._id)
        ? prev.filter((p) => p._id !== post._id)
        : [...prev, post],
    );
  };

  const removeFavorite = (postId) => {
    setFavorites((prev) => prev.filter((p) => p._id !== postId));
  };

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
