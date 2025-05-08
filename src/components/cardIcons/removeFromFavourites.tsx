import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import toast from "../../utils/toastService";

const RemoveFromFavourites: React.FC<BaseMovieProps> = ({ ...movie }) => {
  const context = useContext(MoviesContext);

  const handleRemoveFromFavourites = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Remove the await to make it non-blocking
      context.removeFromFavourites(movie);
      toast.success(`${movie.title} removed from favorites!`);
    } catch (err) {
      toast.error(`Failed to remove from favorites: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <IconButton
      aria-label="remove from favorites"
      onClick={handleRemoveFromFavourites}
    >
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromFavourites;
