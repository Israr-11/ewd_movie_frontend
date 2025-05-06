import React, { useContext } from "react";
import { Typography, Grid, CircularProgress, Box, Button } from "@mui/material";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import MovieCard from "../components/movieCard";
import { BaseMovieProps } from "../types/interfaces";
import { MoviesContext } from "../contexts/moviesContext";

const UpcomingMoviesPage: React.FC = () => {
  const { movies, isLoading, error } = useUpcomingMovies();
  const { addToFavourites } = useContext(MoviesContext);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          Error loading upcoming movies: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Upcoming Movies
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie: BaseMovieProps) => (
          <Grid key={movie.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <MovieCard 
              movie={movie} 
              action={(movie) => (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => addToFavourites(movie)}
                >
                  Add to Favorites
                </Button>
              )} 
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UpcomingMoviesPage;
