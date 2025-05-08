import { useEffect, useState } from "react";
import { getPopularActors } from '../api/tmdb-api';

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
  known_for_department: string;
  known_for: any[];
}

const useActors = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPopularActors()
      .then((data) => {
        setActors(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { actors, isLoading, error };
};

export default useActors;
