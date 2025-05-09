import { getIdToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const addToFavorites = async (movieId: number): Promise<any> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/favorites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      movieId
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add movie to favorites: ${response.status}`);
  }

  return response.json();
};

export const getFavorites = async (): Promise<any> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch favorites: ${response.status}`);
  }
  return response.json();
};


export const removeFromFavorites = async (movieId: number): Promise<any> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/favorites/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to remove movie from favorites: ${response.status}`);
  }

  return response.json();
};


export const reorderFavorites = async (newOrder: { movieId: number, order: number }[]): Promise<any> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/favorites/reorder`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newOrder })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to reorder favorites: ${response.status}`);
  }

  return response.json();
};
