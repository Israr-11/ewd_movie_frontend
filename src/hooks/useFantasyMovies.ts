import { useState, useCallback } from 'react';
import { 
  createFantasyMovie, 
  getUserFantasyMovies, 
  getFantasyMovie, 
  deleteFantasyMovie, 
  addCastMember, 
  FantasyMovie, 
  CastMember 
} from '../api/fantasy-movies-api';

export const useFantasyMovies = () => {
  const [movies, setMovies] = useState<FantasyMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all fantasy movies for the user
  const loadMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedMovies = await getUserFantasyMovies();
      setMovies(fetchedMovies);
    } catch (err) {
      console.error('Failed to load fantasy movies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fantasy movies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a single movie by ID
  const getMovie = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      return await getFantasyMovie(id);
    } catch (err) {
      console.error(`Failed to get fantasy movie ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to get fantasy movie');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new fantasy movie
  const addMovie = useCallback(async (movieData: FantasyMovie) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newMovie = await createFantasyMovie(movieData);
      setMovies(prev => [...prev, newMovie]);
      return newMovie;
    } catch (err) {
      console.error('Failed to create fantasy movie:', err);
      setError(err instanceof Error ? err.message : 'Failed to create fantasy movie');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove a fantasy movie
  const removeMovie = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteFantasyMovie(id);
      setMovies(prev => prev.filter(movie => movie.Id !== id));
    } catch (err) {
      console.error(`Failed to delete fantasy movie ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete fantasy movie');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add cast member to a movie
  const addCastToMovie = useCallback(async (movieId: number, castMember: CastMember) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedMovie = await addCastMember(movieId, castMember);
      
      // Update the movie in the local state
      setMovies(prev => 
        prev.map(movie => 
          movie.Id === movieId ? updatedMovie : movie
        )
      );
      
      return updatedMovie;
    } catch (err) {
      console.error(`Failed to add cast member to movie ${movieId}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add cast member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    movies,
    isLoading,
    error,
    loadMovies,
    getMovie,
    addMovie,
    removeMovie,
    addCastToMovie
  };
};
