import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { Typography, Alert, Box, Button } from "@mui/material";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import ReviewsModal from "../components/reviewModal";
import RateReviewIcon from "@mui/icons-material/RateReview";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

const FavouriteMoviesPage: React.FC = () => {
  const { 
    favourites: movieIds, 
    isLoading: contextLoading, 
    error: contextError,
    loadFavorites 
  } = useContext(MoviesContext);
  
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);
  
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );
  const navigate = useNavigate();

  // Check authentication and load favorites ONCE when the component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    
    // Only load favorites if we haven't already
    if (!hasLoadedFavorites) {
      loadFavorites().then(() => {
        setHasLoadedFavorites(true);
      });
    }
  }, [navigate, loadFavorites, hasLoadedFavorites]);

  // Create an array of queries to fetch movie details from TMDB API
  const favouriteMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", movieId],
        queryFn: () => getMovie(movieId.toString()),
        staleTime: 60 * 60 * 1000, // Cache for 1 hour
        cacheTime: 60 * 60 * 1000, // Keep in cache for 1 hour
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch when component mounts if data is already in cache
      };
    })
  );

  // Check if any of the parallel queries is still loading
  const isLoading = contextLoading || favouriteMovieQueries.some(query => query.isLoading);
  
  // Check if there are any errors
  const queryErrors = favouriteMovieQueries.filter(query => query.isError);
  const hasErrors = contextError || queryErrors.length > 0;

  if (isLoading) {
    return <Spinner />;
  }

  if (hasErrors) {
    return (
      <Alert severity="error" sx={{ mt: 2, mx: 2 }}>
        {contextError || "Failed to fetch one or more favorite movies"}
      </Alert>
    );
  }

  // Extract movie data from queries
  const allFavourites = favouriteMovieQueries
    .filter(query => query.data) // Filter out any undefined data
    .map(query => query.data);
    
  // Apply filtering
  const displayedMovies = filterFunction(allFavourites);

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title" ? [changedFilter, filterValues[1]] : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  return (
    <>
      {movieIds.length === 0 ? (
        <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
          You haven't added any favorites yet.
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RateReviewIcon />}
              onClick={() => setReviewsModalOpen(true)}
            >
              View My Reviews
            </Button>
          </Box>
          
          <PageTemplate
            title="Favourite Movies"
            movies={displayedMovies}
            action={(movie) => {
              return (
                <>
                  <RemoveFromFavourites {...movie} />
                  <WriteReview {...movie} />
                </>
              );
            }}
          />

          <MovieFilterUI
            onFilterValuesChange={changeFilterValues}
            titleFilter={filterValues[0].value}
            genreFilter={filterValues[1].value}
          />
          
          <ReviewsModal 
            open={reviewsModalOpen} 
            onClose={() => setReviewsModalOpen(false)} 
          />
        </>
      )}
    </>
  );
};

export default FavouriteMoviesPage;
