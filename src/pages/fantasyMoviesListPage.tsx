import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Fab,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFantasyMovies } from '../hooks/useFantasyMovies';
import { isAuthenticated } from '../utils/auth';
import toast from '../utils/toastService';

const FantasyMoviesListPage = () => {
  const navigate = useNavigate();
  const { movies, isLoading, error, loadMovies, removeMovie } = useFantasyMovies();
  
  // Check if user is authenticated and load movies
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    
    loadMovies();
  }, [navigate, loadMovies]);
  
  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await removeMovie(id);
        toast.success(`"${title}" has been deleted`);
      } catch (err) {
        toast.error(`Failed to delete movie: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Fantasy Movies
        </Typography>
        
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/fantasy-movies/create')}
        >
          <AddIcon />
        </Fab>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any fantasy movies yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fantasy-movies/create')}
            sx={{ mt: 2 }}
          >
            Create Your First Fantasy Movie
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.Id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.PosterUrl || '/placeholder-poster.jpg'}
                  alt={movie.Title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.Title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {movie.ReleaseDate} • {movie.Runtime} min
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {movie.Genres.map((genre) => (
                      <Chip key={genre} label={genre} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {movie.Overview}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/fantasy-movies/${movie.Id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(movie.Id!, movie.Title)}
                    sx={{ marginLeft: 'auto' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FantasyMoviesListPage;
