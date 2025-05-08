import { getIdToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://p68l7lqe8e.execute-api.us-east-1.amazonaws.com/prod';

// Get all playlists for the current user
export const getPlaylists = async (): Promise<any> => {
  const token = getIdToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_URL}/api/playlists`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch playlists: ${response.status}`);
  }
  
  return response.json();
};

// Create a new playlist
export const createPlaylist = async (title: string, description: string): Promise<any> => {
  const token = getIdToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_URL}/api/playlists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Title: title,
      Description: description
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create playlist: ${response.status}`);
  }
  
  return response.json();
};

// Delete a playlist
export const deletePlaylist = async (playlistId: number): Promise<any> => {
  const token = getIdToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_URL}/api/playlists/${playlistId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete playlist: ${response.status}`);
  }
  
  return response.json();
};

// Add a movie to a playlist
export const addMovieToPlaylist = async (playlistId: number, movieId: number): Promise<any> => {
  const token = getIdToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_URL}/api/playlists/${playlistId}/movies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      movieId: movieId
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add movie to playlist: ${response.status}`);
  }
  
  return response.json();
};

// Remove a movie from a playlist
export const removeMovieFromPlaylist = async (playlistId: number, movieId: number): Promise<any> => {
  const token = getIdToken();
  
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_URL}/api/playlists/${playlistId}/movies/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to remove movie from playlist: ${response.status}`);
  }
  
  return response.json();
};
