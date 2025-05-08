import { useEffect, useState } from "react";
import { getActorDetails, getActorMovieCredits } from '../api/tmdb-api';

interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  also_known_as: string[];
}

interface ActorMovieCredits {
  cast: any[];
  crew: any[];
}

const useActorDetails = (id: string) => {
  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [credits, setCredits] = useState<ActorMovieCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Fetch actor details and movie credits in parallel
    Promise.all([
      getActorDetails(id),
      getActorMovieCredits(id)
    ])
      .then(([actorData, creditsData]) => {
        setActor(actorData);
        setCredits(creditsData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [id]);

  return { actor, credits, isLoading, error };
};

export default useActorDetails;
