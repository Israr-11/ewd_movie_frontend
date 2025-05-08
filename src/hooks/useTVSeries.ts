import { useEffect, useState } from "react";
import { getPopularTVSeries } from '../api/tmdb-api';

interface TVSeries {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
  overview: string;
}

const useTVSeries = () => {
  const [tvSeries, setTVSeries] = useState<TVSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPopularTVSeries()
      .then((data) => {
        setTVSeries(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { tvSeries, isLoading, error };
};

export default useTVSeries;
