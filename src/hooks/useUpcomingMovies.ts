import { useEffect, useState } from "react";
import { getUpcomingMovies } from '../api/tmdb-api';
import { BaseMovieProps } from '../types/interfaces';

const useUpcomingMovies = () => {
  const [movies, setMovies] = useState<BaseMovieProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getUpcomingMovies()
      .then((data) => {
        setMovies(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { movies, isLoading, error };
};

export default useUpcomingMovies;
