import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";

const RemoveFromWatchlist: React.FC<BaseMovieProps> = ({ id }) => {
  const context = useContext(MoviesContext);

  const handleRemoveFromWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    context.removeFromWatchlist({ id } as BaseMovieProps);
  };

  return (
    <IconButton
      aria-label="remove from watchlist"
      onClick={handleRemoveFromWatchlist}
    >
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromWatchlist;
