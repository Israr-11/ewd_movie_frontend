import React from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  Rating, 
  Button,
  Divider,
  styled,
  CircularProgress,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMovie } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { MovieDetailsProps } from "../types/interfaces";
import MovieDetails from "../components/movieDetails";
import PageTemplate from "../components/templateMoviePage";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';

// Styled components for enhanced design
const BackButton = styled(Button)({
  color: "#E50914",
  marginBottom: "1.5rem",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
  "& .MuiSvgIcon-root": {
    color: "#E50914",
  }
});

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: movie, error, isLoading, isError } = useQuery<MovieDetailsProps, Error>(
    ["movie", id],
    () => getMovie(id || "")
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">{(error as Error).message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <BackButton 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
      >
        Back
      </BackButton>
      
      {movie ? (
        <PageTemplate movie={movie}> 
          <MovieDetails {...movie} />
        </PageTemplate>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: "#E50914" }} />
        </Box>
      )}
    </Box>
  );
};

export default MovieDetailsPage;
