import { getIdToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const submitReview = async (movieId: number, review: string, rating: number): Promise<any> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}movies/reviews`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      movieId,
      review,
      rating
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to submit review: ${response.status}`);
  }

  return response.json();
};

export const getUserReviews = async (userId: string): Promise<any[]> => {
  const response = await fetch(`${API_URL}movies/reviews?userId=${userId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch user reviews: ${response.status}`);
  }

  return response.json();
};
