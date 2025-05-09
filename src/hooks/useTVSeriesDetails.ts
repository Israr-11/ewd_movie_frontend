import { useEffect, useState } from "react";
import { getTVSeriesDetails, getTVSeriesImages } from '../api/tmdb-api';

interface TVSeriesDetails {
  type: string;
  origin_country: any;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  genres: { id: number; name: string }[];
  created_by: { id: number; name: string; profile_path: string }[];
  networks: { id: number; name: string; logo_path: string }[];
  seasons: any[];
}

const useTVSeriesDetails = (id: string) => {
  const [tvSeries, setTVSeries] = useState<TVSeriesDetails | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Fetch TV series details and images in parallel
    Promise.all([
      getTVSeriesDetails(id),
      getTVSeriesImages(id)
    ])
      .then(([seriesData, imagesData]) => {
        setTVSeries(seriesData);
        setImages(imagesData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [id]);

  return { tvSeries, images, isLoading, error };
};

export default useTVSeriesDetails;
