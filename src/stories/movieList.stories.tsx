import type { Meta } from '@storybook/react';
import MovieList from "../components/movieList";
import SampleMovie from "./sampleData";
import { MemoryRouter } from "react-router";

import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import Grid from "@mui/material/Grid";
import MoviesContextProvider from "../contexts/moviesContext";
import { BaseMovieProps } from '../types/interfaces';

const meta = {
  title: "Home Page/MovieList",
  component: MovieList,
  decorators: [
      (Story) => <MemoryRouter initialEntries={["/"]}><Story /></MemoryRouter>,
      (Story) => <MoviesContextProvider><Story /></MoviesContextProvider>,
    ],
    
} satisfies Meta<typeof MovieList>;
export default meta;


export const Basic = () => {
  const sampleMovieAsBaseProps = {
    ...SampleMovie,
    isError: false,
    movie: SampleMovie
  } as BaseMovieProps;

  const movies: BaseMovieProps[] = [
    { ...sampleMovieAsBaseProps, id: 1 },
    { ...sampleMovieAsBaseProps, id: 2 },
    { ...sampleMovieAsBaseProps, id: 3 },
    { ...sampleMovieAsBaseProps, id: 4 },
    { ...sampleMovieAsBaseProps, id: 5 },
  ];

  return (
    <Grid container spacing={5}>
      <MovieList
        movies={movies}
        action={(movie) => <AddToFavouritesIcon {...movie} />}
      />
    </Grid>
  );
};
Basic.storyName = "Default";
