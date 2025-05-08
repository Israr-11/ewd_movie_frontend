import React from "react";
import { Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import useActors from "../hooks/useActors";
import img from '../images/film-poster-placeholder.png';

const ActorsPage = () => {
  const { actors, isLoading, error } = useActors();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Popular Actors
      </Typography>
      
      <Grid container spacing={3}>
        {actors.map((actor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id}>
            <Link to={`/actors/${actor.id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="350"
                  image={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : img}
                  alt={actor.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {actor.known_for_department}
                  </Typography>
                  {actor.known_for && actor.known_for.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Known for: {actor.known_for.map(item => item.title || item.name).slice(0, 2).join(', ')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActorsPage;
