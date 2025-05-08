import React, { useContext, useState } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import { BaseMovieProps } from "../../types/interfaces";
import { isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import toast from "../../utils/toastService";


const AddToFavouritesIcon: React.FC<BaseMovieProps> = ({ ...movie }) => {
  const context = useContext(MoviesContext);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddToFavourites = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    
    try {
      setIsAdding(true);
      await context.addToFavourites(movie);
      toast.success(`${movie.title} added to favorites!`);
    } catch (err) {
      toast.error(`Failed to add to favorites: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      // Add this line to reset the loading state
      setIsAdding(false);
    }   
  };

  return (
    <IconButton 
      aria-label="add to favorites" 
      onClick={handleAddToFavourites}
      disabled={isAdding}
    >
      {isAdding ? (
        <CircularProgress size={24} color="primary" />
      ) : (
        <FavoriteIcon color="primary" fontSize="large" />
      )}
    </IconButton>
  );
};

export default AddToFavouritesIcon;
