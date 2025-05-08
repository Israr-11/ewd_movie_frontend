import React from "react";
import { useParams } from "react-router-dom";
import { 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  Divider, 
  CircularProgress, 
  Alert,
  Paper,
  Rating,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import useTVSeriesDetails from "../hooks/useTVSeriesDetails";
import img from '../images/film-poster-placeholder.png';

const TVSeriesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tvSeries, images, isLoading, error } = useTVSeriesDetails(id || "");

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

  if (!tvSeries) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">TV series not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Left column - Poster and basic info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={tvSeries.poster_path ? `https://image.tmdb.org/t/p/w500${tvSeries.poster_path}` : img}
              alt={tvSeries.name}
              sx={{ height: 500, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {tvSeries.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={tvSeries.vote_average / 2} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {tvSeries.vote_average.toFixed(1)}/10
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                First aired: {new Date(tvSeries.first_air_date).toLocaleDateString()}
              </Typography>
              
              {tvSeries.last_air_date && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last aired: {new Date(tvSeries.last_air_date).toLocaleDateString()}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status: {tvSeries.status}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Seasons: {tvSeries.number_of_seasons} | Episodes: {tvSeries.number_of_episodes}
              </Typography>
              
              {tvSeries.genres && tvSeries.genres.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Genres:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {tvSeries.genres.map((genre) => (
                      <Chip key={genre.id} label={genre.name} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {tvSeries.networks && tvSeries.networks.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Networks:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {tvSeries.networks.map((network) => (
                      <Chip key={network.id} label={network.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - Overview and seasons */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {tvSeries.overview || "No overview available."}
            </Typography>
            
            {tvSeries.created_by && tvSeries.created_by.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Created by:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tvSeries.created_by.map((creator) => (
                    <Chip key={creator.id} label={creator.name} />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
          
          {tvSeries.seasons && tvSeries.seasons.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Seasons
              </Typography>
              <List>
                {tvSeries.seasons.map((season) => (
                  <React.Fragment key={season.id}>
                    <ListItem alignItems="flex-start">
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        {season.poster_path && (
                          <Box sx={{ flexShrink: 0, mr: 2 }}>
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${season.poster_path}`} 
                              alt={season.name}
                              style={{ width: 100, borderRadius: 4 }}
                            />
                          </Box>
                        )}
                        <ListItemText
                          primary={season.name}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" component="span">
                                {season.episode_count} episodes
                              </Typography>
                              {season.air_date && (
                                <Typography variant="body2" component="div">
                                  Air date: {new Date(season.air_date).toLocaleDateString()}
                                </Typography>
                              )}
                              {season.overview && (
                                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                  {season.overview}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TVSeriesDetailsPage;
