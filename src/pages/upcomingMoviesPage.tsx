import React, { useContext } from "react";
import { Typography, Grid, Box, styled } from "@mui/material";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import MovieCard from "../components/movieCard";
import { BaseMovieProps } from "../types/interfaces";
import Spinner from "../components/spinner";
import AddToPlaylist from "../components/playlist/addToPlaylist";

const PageContainer = styled(Box)({
  position: "relative",
  padding: "1.5rem 1rem",
  width: "97.9%",
  marginBottom: "80px",
  minHeight: "calc(100vh - 180px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#141414",
});

const PageTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  borderBottom: "2px solid #E50914",
  paddingBottom: "0.5rem",
  display: "inline-block",
});

const EnhancedAddToPlaylist = (props: BaseMovieProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        "& .MuiIconButton-root": {
          color: "#E50914",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "rgba(229, 9, 20, 0.1)",
          },
        },
      }}
    >
      <AddToPlaylist {...props} />
    </Box>
  );
};

const UpcomingMoviesPage: React.FC = () => {
  const { movies, isLoading, isError, error } = useUpcomingMovies();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error?.message}</h1>;
  }

  return (
    <PageContainer>
      <PageTitle variant="h4">Upcoming Movies</PageTitle>
      <Grid container spacing={3}>
        {movies.map((movie: BaseMovieProps) => (
          <Grid key={movie.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
            <MovieCard
              movie={movie}
              action={<EnhancedAddToPlaylist {...movie} />}
            />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};
export default UpcomingMoviesPage;
