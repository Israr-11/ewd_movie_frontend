import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Container, 
  Grid, 
  Box, 
  CircularProgress, 
  Alert, 
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from "@mui/material";
import { PlaylistContext } from "../contexts/playlistContext";
import { isAuthenticated } from "../utils/auth";
import { getMovie } from "../api/tmdb-api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import img from '../images/film-poster-placeholder.png';

// Define the structure of a movie in the playlist
interface PlaylistMovie {
  Order: number;
  AddedDate: string;
  MovieId: number;
}

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const playlistId = Number(id);
  const navigate = useNavigate();
  const { playlists, isLoading: playlistsLoading, error: playlistsError, loadPlaylists } = useContext(PlaylistContext);
  const [playlist, setPlaylist] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Check authentication and load playlists
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    if (!hasLoadedRef.current) {
      loadPlaylists();
      hasLoadedRef.current = true;
    }
  }, [navigate]);

  // Find the current playlist from the loaded playlists
  useEffect(() => {
    if (!playlistsLoading && playlists.length > 0) {
      const currentPlaylist = playlists.find(p => p.Id === playlistId);
      if (currentPlaylist) {
        setPlaylist(currentPlaylist);
        
        // Check if Movies exists and is an array
        if (Array.isArray(currentPlaylist.Movies) && currentPlaylist.Movies.length > 0) {
          // Fetch movie details one by one
          const fetchMovies = async () => {
            setIsLoading(true);
            
            // Extract movie IDs from the Movies array
            const moviePromises = currentPlaylist.Movies.map(async (movieItem: PlaylistMovie | number) => {
              // Handle both formats: object with MovieId or direct number
              const movieId = typeof movieItem === 'object' ? movieItem.MovieId : movieItem;
              
              try {
                console.log(`Fetching movie with ID: ${movieId}`);
                const movieData = await getMovie(movieId.toString());
                return movieData;
              } catch (err) {
                console.error(`Failed to fetch movie ${movieId}:`, err);
                return null;
              }
            });
            
            const movieResults = await Promise.all(moviePromises);
            const validMovies = movieResults.filter(movie => movie !== null);
            console.log(`Successfully loaded ${validMovies.length} movies`);
            setMovies(validMovies);
            setIsLoading(false);
          };
          
          fetchMovies();
        } else {
          console.log("No movies in playlist or Movies is not an array");
          setMovies([]);
          setIsLoading(false);
        }
      } else {
        setError("Playlist not found");
        setIsLoading(false);
      }
    }
  }, [playlistsLoading, playlists, playlistId]);

  const handleBackToUpcoming = () => {
    navigate("/movies/upcoming");
  };

  const handleBackToPlaylists = () => {
    navigate("/movies/playlists");
  };

  if (isLoading || playlistsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || playlistsError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || playlistsError}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToPlaylists}
        >
          Back to Playlists
        </Button>
      </Container>
    );
  }

  if (!playlist) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Playlist not found
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToPlaylists}
          sx={{ mt: 2 }}
        >
          Back to Playlists
        </Button>
      </Container>
    );
  }

  // Calculate the number of movies in the playlist
  const movieCount = Array.isArray(playlist.Movies) ? playlist.Movies.length : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToPlaylists}
        >
          Back to Playlists
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBackToUpcoming}
        >
          Go to Upcoming Movies
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {playlist.Title}
      </Typography>

      {playlist.Description && (
        <Typography variant="body1" paragraph>
          {playlist.Description}
        </Typography>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {movieCount} movies in this playlist
        </Typography>
        {playlist.CreatedDate && (
          <Typography variant="caption" color="text.secondary" display="block">
            Created: {new Date(playlist.CreatedDate).toLocaleDateString()}
          </Typography>
        )}
        {playlist.UpdatedDate && (
          <Typography variant="caption" color="text.secondary" display="block">
            Last updated: {new Date(playlist.UpdatedDate).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {movies.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6">
            This playlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add movies to this playlist from the movie details page
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBackToUpcoming}
            sx={{ mt: 3 }}
          >
            Browse Upcoming Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : img
                  }
                  alt={movie.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.release_date?.substring(0, 4)}
                    {movie.vote_average ? ` • ${movie.vote_average.toFixed(1)}/10` : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    fullWidth
                  >
                    Watch Movie
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

export default PlaylistDetailsPage;
