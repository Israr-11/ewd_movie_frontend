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
    <Container maxWidth="lg" sx={{ 
      backgroundColor: "#121212", // Slightly lighter than pure black for better contrast
      width: "100%", 
      mb: 10,
      pt: 3,
      borderRadius: 1
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 2
      }}>
        <Typography variant="h4"  component="h1" sx={{
          color: '#fff',
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: '40%',
            height: '3px',
          }
        }}>
          My Fantasy Movies
        </Typography>
        
        <Fab
          color="error"
          aria-label="add"
          onClick={() => navigate('/fantasy-movies/create')}
          sx={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)'
            },
            transition: 'all 0.2s ease'
          }}
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
          <CircularProgress color="error" />
        </Box>
      ) : movies.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          my: 8,
          py: 6,
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
            You haven't created any fantasy movies yet
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => navigate('/fantasy-movies/create')}
            sx={{ 
              mt: 2,
              px: 3,
              py: 1,
              fontWeight: 'medium',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            Create Your First Fantasy Movie
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.Id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex',
                marginTop:-1,
                flexDirection: 'column',
                backgroundColor: 'rgba(40, 40, 40, 0.9)', // Slightly lighter for better readability
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.PosterUrl || '/placeholder-poster.jpg'}
                  alt={movie.Title}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ 
                    fontWeight: 'bold',
                    color: '#ffffff' // Pure white for title - maximum readability
                  }}>
                    {movie.Title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mb: 2, 
                    color: '#e0e0e0' // Light gray for better readability
                  }}>
                    {movie.ReleaseDate} • {movie.Runtime} min
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {movie.Genres.map((genre) => (
                      <Chip 
                        key={genre} 
                        label={genre} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(229, 9, 20, 0.2)', 
                          color: '#ffffff',
                          border: '1px solid rgba(229, 9, 20, 0.3)',
                          mr: 0.5,
                          mb: 0.5
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" noWrap sx={{ 
                    color: '#cccccc' // Lighter gray for better readability
                  }}>
                    {movie.Overview}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/fantasy-movies/${movie.Id}`)}
                    sx={{ 
                      color: '#ffffff', // Pure white for button text
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
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
