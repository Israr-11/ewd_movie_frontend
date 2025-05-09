import React, { useContext, useState, useEffect } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CircularProgress from "@mui/material/CircularProgress";
import { BaseMovieProps } from "../../types/interfaces";
import { isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import toast from "../../utils/toastService";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(13, 13, 13, 0.7)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(13, 13, 13, 0.9)',
    transform: 'scale(1.1)',
  },
  '&:disabled': {
    backgroundColor: 'rgba(13, 13, 13, 0.5)',
  },
  padding: 8,
  margin: 0,
}));

const StyledFavoriteIcon = styled(FavoriteIcon)({
  color: '#E50914',
  filter: 'drop-shadow(0px 0px 3px rgba(229, 9, 20, 0.5))',
});

const StyledFavoriteBorderIcon = styled(FavoriteBorderIcon)({
  color: '#E50914',
  filter: 'drop-shadow(0px 0px 3px rgba(229, 9, 20, 0.5))',
});

const FavoriteIconWhite = styled(FavoriteIcon)({
  color: '#FFFFFF',
  filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))',
});

const StyledCircularProgress = styled(CircularProgress)({
  color: '#E50914',
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#E50914',
    color: '#FFFFFF',
    boxShadow: `0 0 0 2px #0D0D0D`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const AddToFavouritesIcon: React.FC<BaseMovieProps> = ({ ...movie }) => {
  const context = useContext(MoviesContext);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Check if movie is already in favorites
  useEffect(() => {
    // This assumes your context has a way to check if a movie is in favorites
    // Adjust according to your actual implementation
    const checkIfFavorite = async () => {
      try {
        // This is a placeholder - replace with your actual method to check favorites
        const favorites = await context.favourites || [];
        setIsFavorite(favorites.some((fav: any) => fav.id === movie.id));
      } catch (err) {
        console.error("Error checking favorites:", err);
      }
    };    
    if (isAuthenticated()) {
      checkIfFavorite();
    }
  }, [context, movie.id]);

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
      setIsFavorite(true);
      setJustAdded(true);
      toast.success(`${movie.title} added to favorites!`);
      
      // Reset the "just added" state after animation
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (err) {
      toast.error(`Failed to add to favorites: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAdding(false);
    }   
  };

  if (isAdding) {
    return (
      <FavoriteButton disabled>
        <StyledCircularProgress size={24} />
      </FavoriteButton>
    );
  }

  if (justAdded) {
    return (
      <Zoom in={true}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          badgeContent={<CheckCircleIcon fontSize="small" />}
        >
          <FavoriteButton>
            <FavoriteIconWhite fontSize="large" />
          </FavoriteButton>
        </StyledBadge>
      </Zoom>
    );
  }

  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <FavoriteButton 
        aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
        onClick={handleAddToFavourites}
      >
        {isFavorite ? (
          <FavoriteIconWhite fontSize="large" />
        ) : (
          <StyledFavoriteBorderIcon fontSize="large" />
        )}
      </FavoriteButton>
    </Tooltip>
  );
};

export default AddToFavouritesIcon;
