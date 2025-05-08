import React from "react";
import { Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Alert, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import useTVSeries from "../hooks/useTVSeries";
import img from '../images/film-poster-placeholder.png';

const TVSeriesPage = () => {
  const { tvSeries, isLoading, error } = useTVSeries();

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
        Popular TV Series
      </Typography>
      
      <Grid container spacing={3}>
        {tvSeries.map((series) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={series.id}>
            <Link to={`/tv/${series.id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="350"
                  image={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : img}
                  alt={series.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {series.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={series.vote_average / 2} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {series.vote_average.toFixed(1)}/10
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    First aired: {new Date(series.first_air_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                    {series.overview}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TVSeriesPage;
