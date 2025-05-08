import React, { useContext } from "react";
import { Typography, Grid, Button } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import MovieCard from "../components/movieCard";
import { BaseMovieProps } from "../types/interfaces";
import { MoviesContext } from "../contexts/moviesContext";
import Spinner from "../components/spinner";
import AddToPlaylist from "../components/playlist/addToPlaylist";

const UpcomingMoviesPage: React.FC = () => {
  const { movies, isLoading, isError, error } = useUpcomingMovies();
 // const { addToWatchlist } = useContext(MoviesContext); // Use addToWatchlist instead of addToFavourites

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error?.message}</h1>;
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
                <AddToPlaylist {...movie} />
              )} 
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UpcomingMoviesPage;
