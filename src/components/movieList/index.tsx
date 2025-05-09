import React from "react";
import MovieCard from "../movieCard/index";
import Grid from "@mui/material/Grid";
import { BaseMovieListProps } from "../../types/interfaces";

const MovieList: React.FC<BaseMovieListProps> = ({ movies, action }) => {
  let movieCards = movies.map((m) => (
    <Grid key={m.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
      <MovieCard key={m.id} movie={m} action={action(m)} />
    </Grid>
  ));
  return movieCards;
};

export default MovieList;
