import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getPlaylists, 
  createPlaylist, 
  deletePlaylist, 
  addMovieToPlaylist, 
  removeMovieFromPlaylist 
} from '../api/playlist-api';
import { Playlist } from '../types/interfaces';
import { isAuthenticated } from '../utils/auth';
import toast from '../utils/toastService';

interface PlaylistContextType {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  loadPlaylists: () => Promise<void>;
  createNewPlaylist: (title: string, description: string) => Promise<Playlist>;
  removePlaylist: (playlistId: number) => Promise<void>;
  addToPlaylist: (playlistId: number, movieId: number) => Promise<void>;
  removeFromPlaylist: (playlistId: number, movieId: number) => Promise<void>;
}

export const PlaylistContext = createContext<PlaylistContextType>({
  playlists: [],
  isLoading: false,
  error: null,
  loadPlaylists: async () => {},
  createNewPlaylist: async () => ({ Id: 0, UserId: '', Title: '', Description: '', Movies: [], CreatedDate: '', UpdatedDate: '' }),
  removePlaylist: async () => {},
  addToPlaylist: async () => {},
  removeFromPlaylist: async () => {}
});

export const PlaylistProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false); // Add this to track if we've loaded playlists

  // Load playlists when the component mounts if authenticated
  useEffect(() => {
    if (isAuthenticated() && !hasLoaded) {
      loadPlaylists();
    } else if (!isAuthenticated()) {
      // Clear playlists when not authenticated
      setPlaylists([]);
    }
  }, [hasLoaded]); // Only depend on hasLoaded, not loadPlaylists

  // Function to load playlists from the API
  const loadPlaylists = useCallback(async () => {
    if (!isAuthenticated()) {
      setPlaylists([]);
      return;
    }
    
    // If already loading, don't start another request
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const playlistsData = await getPlaylists();
      setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
      setHasLoaded(true); // Mark as loaded
    } catch (err) {
      console.error("Failed to load playlists:", err);
      setError(err instanceof Error ? err.message : "Failed to load playlists");
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // Only depend on isLoading

  // Rest of the code remains the same...
  
  // Create a new playlist
  const createNewPlaylist = async (title: string, description: string): Promise<Playlist> => {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to create a playlist");
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const newPlaylist = await createPlaylist(title, description);
      
      // Update local state
      setPlaylists(prev => [...prev, newPlaylist]);
      
      toast.success(`Playlist "${title}" created successfully!`);
      return newPlaylist;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create playlist";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a playlist
  const removePlaylist = async (playlistId: number) => {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to delete a playlist");
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await deletePlaylist(playlistId);
      
      // Update local state
      setPlaylists(prev => prev.filter(playlist => playlist.Id !== playlistId));
      
      toast.success("Playlist deleted successfully!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete playlist";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a movie to a playlist
  const addToPlaylist = async (playlistId: number, movieId: number) => {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to add to a playlist");
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await addMovieToPlaylist(playlistId, movieId);
      
      // Update local state
      setPlaylists(prev => prev.map(playlist => {
        if (playlist.Id === playlistId) {
          return {
            ...playlist,
            Movies: [...playlist.Movies, movieId]
          };
        }
        return playlist;
      }));
      
      toast.success("Movie added to playlist!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add movie to playlist";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a movie from a playlist
  const removeFromPlaylist = async (playlistId: number, movieId: number) => {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to remove from a playlist");
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await removeMovieFromPlaylist(playlistId, movieId);
      
      // Update local state
      setPlaylists(prev => prev.map(playlist => {
        if (playlist.Id === playlistId) {
          return {
            ...playlist,
            Movies: playlist.Movies.filter(id => id !== movieId)
          };
        }
        return playlist;
      }));
      
      toast.success("Movie removed from playlist!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to remove movie from playlist";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        error,
        loadPlaylists,
        createNewPlaylist,
        removePlaylist,
        addToPlaylist,
        removeFromPlaylist
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
