import React, { useState, useEffect, useCallback } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../api/favorites-api";
import { isAuthenticated } from "../utils/auth";

interface MovieContextInterface {
  favourites: number[];
  addToFavourites: (movie: BaseMovieProps) => Promise<void>;
  removeFromFavourites: (movie: BaseMovieProps) => Promise<void>;
  loadFavorites: () => Promise<void>;
  addReview: (movie: BaseMovieProps, review: Review) => void;
  myReviews: Record<string, Review>;
  isLoading: boolean;
  error: string | null;
}

const initialContextState: MovieContextInterface = {
  favourites: [],
  addToFavourites: async () => {},
  removeFromFavourites: async () => {},
  loadFavorites: async () => {},
  addReview: (movie, review) => {
    movie.id, review;
  },
  myReviews: {},
  isLoading: false,
  error: null,
};

export const MoviesContext =
  React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [myReviews, setMyReviews] = useState<Record<string, Review>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavorites();
    } else {
      setFavourites([]);
    }
  }, []);

  const loadFavorites = async () => {
    if (!isAuthenticated()) {
      setFavourites([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const favoritesData = await getFavorites();
      const movieIds = Array.isArray(favoritesData)
        ? favoritesData.map((fav: any) => fav.MovieId)
        : [];

      setFavourites(movieIds);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError(err instanceof Error ? err.message : "Failed to load favorites");
      setFavourites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavourites = useCallback(async (movie: BaseMovieProps) => {
    if (!isAuthenticated()) {
      setError("You must be logged in to add favorites");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await addToFavorites(movie.id);

      setFavourites((prev) => {
        if (!prev.includes(movie.id)) {
          return [...prev, movie.id];
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to add to favorites:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add to favorites"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromFavourites = useCallback(async (movie: BaseMovieProps) => {
    if (!isAuthenticated()) {
      setError("You must be logged in to remove favorites");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await removeFromFavorites(movie.id);
      setFavourites((prev) => prev.filter((id) => id !== movie.id));
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove from favorites"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReview = (movie: BaseMovieProps, review: Review) => {
    setMyReviews((prev) => ({
      ...prev,
      [movie.id]: review,
    }));
  };

  return (
    <MoviesContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        loadFavorites,
        addReview,
        myReviews,
        isLoading,
        error,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
