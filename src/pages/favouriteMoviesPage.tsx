import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter } from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { Typography, Alert, Box, Button, styled } from "@mui/material";
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

const PageContainer = styled(Box)({
  position: "relative",
  padding: "0 1rem",
  marginLeft: "-1rem",
  width: "99.98%",
  marginBottom: "80px",
  minHeight: "calc(100vh - 180px)",
  display: "flex",
  flexDirection: "column",
});

const ReviewsButton = styled(Button)({
  backgroundColor: "#E50914",
  color: "#FFFFFF",
  fontWeight: "bold",
  padding: "8px 16px",
  marginTop: "1.7rem",
  marginRight: "1.7rem",
  "&:hover": {
    backgroundColor: "#B2070F",
    boxShadow: "0 4px 8px rgba(229, 9, 20, 0.4)",
  },
  transition: "all 0.3s ease",
  textTransform: "none",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  position: "absolute",
  right: "1rem",
  top: "0",
  zIndex: 10,
});

const EmptyStateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  backgroundColor: "rgba(13, 13, 13, 0.7)",
  borderRadius: "8px",
  padding: "2rem",
  margin: "2rem 0",
  border: "1px solid #333333",
});

const EmptyStateText = styled(Typography)({
  color: "#FFFFFF",
  textAlign: "center",
  marginBottom: "1.5rem",
});

const FavouriteMoviesPage: React.FC = () => {
  const {
    favourites: movieIds,
    isLoading: contextLoading,
    error: contextError,
    loadFavorites,
  } = useContext(MoviesContext);

  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);

  const { filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    if (!hasLoadedFavorites) {
      loadFavorites().then(() => {
        setHasLoadedFavorites(true);
      });
    }
  }, [navigate, loadFavorites, hasLoadedFavorites]);

  const favouriteMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", movieId],
        queryFn: () => getMovie(movieId.toString()),
        staleTime: 60 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      };
    })
  );

  const isLoading =
    contextLoading || favouriteMovieQueries.some((query) => query.isLoading);

  const queryErrors = favouriteMovieQueries.filter((query) => query.isError);
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

  const allFavourites = favouriteMovieQueries
    .filter((query) => query.data)
    .map((query) => query.data);

  const displayedMovies = filterFunction(allFavourites);


  return (
    <PageContainer>
      {movieIds.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateText variant="h5">
            You haven't added any favorites yet.
          </EmptyStateText>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#E50914",
              "&:hover": { backgroundColor: "#B2070F" },
            }}
          >
            Discover Movies
          </Button>
        </EmptyStateContainer>
      ) : (
        <>
          <ReviewsButton
            variant="contained"
            startIcon={<RateReviewIcon />}
            onClick={() => setReviewsModalOpen(true)}
          >
            View My Reviews
          </ReviewsButton>

          <PageTemplate
            title="Favourite Movies"
            movies={displayedMovies}
            action={(movie) => {
              return (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <RemoveFromFavourites {...movie} />
                  <WriteReview {...movie} />
                </Box>
              );
            }}
          />

          <ReviewsModal
            open={reviewsModalOpen}
            onClose={() => setReviewsModalOpen(false)}
          />
        </>
      )}
    </PageContainer>
  );
};

export default FavouriteMoviesPage;
