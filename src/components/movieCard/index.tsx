import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { BaseMovieProps } from "../../types/interfaces";
import img from "../../images/film-poster-placeholder.png";

const StyledCard = styled(Card)(({ }) => ({
  maxWidth: 345,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 10px 20px rgba(229, 9, 20, 0.2)",
  },
  position: "relative",
  overflow: "hidden",
}));

const StyledCardMedia = styled(CardMedia)({
  height: 500,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "30%",
    background: "linear-gradient(to top, #0D0D0D, transparent)",
  },
});

const RatingBox = styled(Box)({
  position: "absolute",
  top: 10,
  right: 10,
  background: "rgba(13, 13, 13, 0.8)",
  borderRadius: "4px",
  padding: "4px 8px",
  display: "flex",
  alignItems: "center",
  zIndex: 1,
});

const YearChip = styled(Chip)({
  position: "absolute",
  top: 10,
  left: 10,
  background: "rgba(229, 9, 20, 0.9)",
  color: "white",
  fontWeight: "bold",
  zIndex: 1,
});

const CardContentStyled = styled(CardContent)({
  flexGrow: 1,
  padding: "16px",
});

const CardActionsStyled = styled(CardActions)({
  padding: "8px 16px 16px 16px",
  justifyContent: "space-between",
});

const MovieTitle = styled(Typography)({
  fontWeight: "bold",
  color: "#FFFFFF",
  marginBottom: "8px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const MovieCard: React.FC<{ movie: BaseMovieProps; action: React.ReactNode }> =
  ({ movie, action }) => {
    const [isHovered, setIsHovered] = useState(false);

    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "";

    return (
      <StyledCard
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {releaseYear && <YearChip label={releaseYear} size="small" />}

        <RatingBox>
          <StarIcon
            sx={{ color: "#E50914", marginRight: "4px", fontSize: "1rem" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#FFFFFF", fontWeight: "bold" }}
          >
            {movie.vote_average.toFixed(1)}
          </Typography>
        </RatingBox>

        <Link
          to={`/movies/${movie.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <StyledCardMedia
            image={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : img
            }
            title={movie.title}
            sx={{
              filter: isHovered ? "brightness(0.7)" : "brightness(0.9)",
              transition: "filter 0.3s ease",
            }}
          />
        </Link>

        <CardContentStyled>
          <Link
            to={`/movies/${movie.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MovieTitle variant="h6">{movie.title}</MovieTitle>
          </Link>

          <Typography
            variant="body2"
            color="#CCCCCC"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "8px",
            }}
          >
            {movie.overview}
          </Typography>
        </CardContentStyled>

        <CardActionsStyled>
          <Rating
            value={movie.vote_average / 2}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#E50914",
              },
            }}
          />
          {action}
        </CardActionsStyled>
      </StyledCard>
    );
  };
export default MovieCard;
