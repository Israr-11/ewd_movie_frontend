import React, { useState } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseMovieProps } from "../../types/interfaces";

export const titleFilter = (movie: BaseMovieProps, value: string): boolean => {
  return movie.title.toLowerCase().search(value.toLowerCase()) !== -1;
};

export const genreFilter = (movie: BaseMovieProps, value: string) => {
  const genreId = Number(value);
  const genreIds = movie.genre_ids;
  return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};

export const ratingFilter = (movie: BaseMovieProps, value: string) => {
  const minRating = Number(value);
  return movie.vote_average >= minRating;
};

export const yearFilter = (movie: BaseMovieProps, value: string) => {
  if (value === "All") return true;
  const year = new Date(movie.release_date).getFullYear().toString();
  return year === value;
};


interface MovieFilterUIProps {
  onFilterValuesChange: (f: string, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  ratingFilter: string;
  yearFilter: string;
  sortByFilter: string;
}

const MovieFilterUI: React.FC<MovieFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  ratingFilter,
  yearFilter,
  sortByFilter,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          bgcolor: "#E50914",
          "&:hover": { bgcolor: "#B2070F" },
          marginTop: 8,
          position: "fixed",
          top: 20,
          right: 20,
        }}
      >
        Filter
      </Fab>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterCard
          onUserInput={onFilterValuesChange}
          titleFilter={titleFilter}
          genreFilter={genreFilter}
          ratingFilter={ratingFilter}
          yearFilter={yearFilter}
          sortByFilter={sortByFilter}
        />
      </Drawer>
    </>
  );
};

export default MovieFilterUI;
