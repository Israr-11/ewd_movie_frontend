import { useQuery } from "react-query";
import { getUpcomingMovies } from '../api/tmdb-api';
import { DiscoverMovies } from '../types/interfaces';

const useUpcomingMovies = () => {
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>(
    "upcoming", // Cache key for upcoming movies
    getUpcomingMovies
  );

  return { 
    movies: data ? data.results : [], 
    isLoading, 
    isError,
    error 
  };
};

export default useUpcomingMovies;
