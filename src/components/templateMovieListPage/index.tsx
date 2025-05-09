import React from "react";
import Grid from "@mui/material/Grid";
import { BaseMovieProps } from "../../types/interfaces";
import MovieCard from "../movieCard";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const PageContainer = styled(Container)({
  paddingTop: '2rem',
  paddingBottom: '4rem',
  background: '#0D0D0D',
  minHeight: '100vh',
  maxWidth: '100% !important', // Use more screen width

});

const TitleBox = styled(Box)({
  marginBottom: '2rem',
  borderBottom: '2px solid #E50914',
  paddingBottom: '0.5rem',
});

const PageTitle = styled(Typography)({
  color: '#FFFFFF',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const MovieGrid = styled(Grid)({
  marginTop: '1rem',
});

const PageTemplate: React.FC<{
  title: string;
  movies: BaseMovieProps[];
  action: (movie: BaseMovieProps) => React.ReactNode;
}> = ({ title, movies, action }) => {
  return (
    <PageContainer maxWidth="xl">
      <TitleBox>
        <PageTitle variant="h4">
          {title}
        </PageTitle>
      </TitleBox>
      
      <MovieGrid container spacing={3}>
        {movies.map((movie) => (
          <Grid key={movie.id} item xs={12} sm={6} md={4} lg={4} xl={3}>
            <MovieCard movie={movie} action={action(movie)} />
          </Grid>
        ))}
      </MovieGrid>
    </PageContainer>
  );
};
export default PageTemplate;
