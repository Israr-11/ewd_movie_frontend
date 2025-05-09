import { getIdToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface CastMember {
  Name: string;
  Role: string;
  Description: string;
}

export interface FantasyMovie {
  Id?: number;
  UserId?: string;
  Title: string;
  Overview: string;
  Genres: string[];
  ReleaseDate: string;
  Runtime: number;
  ProductionCompanies: string[];
  PosterUrl: string;
  Cast: CastMember[];
  CreatedDate?: string;
}

export const getPresignedUrl = async (fileType: string): Promise<{
  uploadUrl: string;
  key: string;
  publicUrl: string;
}> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/uploads/presigned-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fileType })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get presigned URL: ${response.status}`);
  }

  return response.json();
};

export const uploadImageToS3 = async (uploadUrl: string, file: File): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status}`);
  }
};

export const createFantasyMovie = async (movieData: FantasyMovie): Promise<FantasyMovie> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/fantasy-movies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movieData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create fantasy movie: ${response.status}`);
  }

  return response.json();
};

export const getUserFantasyMovies = async (): Promise<FantasyMovie[]> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/fantasy-movies`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get fantasy movies: ${response.status}`);
  }

  return response.json();
};

export const getFantasyMovie = async (id: number): Promise<FantasyMovie> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/fantasy-movies/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get fantasy movie: ${response.status}`);
  }

  return response.json();
};

export const addCastMember = async (movieId: number, castMember: CastMember): Promise<FantasyMovie> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/fantasy-movies/${movieId}/cast`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(castMember)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add cast member: ${response.status}`);
  }

  return response.json();
};

export const deleteFantasyMovie = async (id: number): Promise<{ message: string }> => {
  const token = getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/fantasy-movies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete fantasy movie: ${response.status}`);
  }

  return response.json();
};
