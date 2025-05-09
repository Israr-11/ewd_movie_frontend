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
      context.removeFromFavourites(movie);
      toast.success(`${movie.title} removed from favorites!`);
    } catch (err) {
      toast.error(
        `Failed to remove from favorites: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <IconButton
      aria-label="remove from favorites"
      onClick={handleRemoveFromFavourites}
      sx={{
        color: "#E50914",
        padding: "8px",
        height: "40px",
        width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DeleteIcon fontSize="medium" />
    </IconButton>
  );
};

export default RemoveFromFavourites;
