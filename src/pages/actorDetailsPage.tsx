import { useParams } from "react-router-dom";
import { 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Alert,
  Paper
} from "@mui/material";
import useActorDetails from "../hooks/useActorDetails";
import img from '../images/film-poster-placeholder.png';
import movieImg from '../images/film-poster-placeholder.png';
import { Link } from "react-router-dom";

const ActorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { actor, credits, isLoading, error } = useActorDetails(id || "");

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

  if (!actor) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">Actor not found</Alert>
      </Box>
    );
  }

  // Sort cast credits by popularity
  const sortedCastCredits = credits?.cast 
    ? [...credits.cast].sort((a, b) => b.popularity - a.popularity).slice(0, 12)
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Left column - Profile */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : img}
              alt={actor.name}
              sx={{ height: 500, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {actor.name}
              </Typography>
              
              {actor.birthday && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Born: {new Date(actor.birthday).toLocaleDateString()}
                  {actor.place_of_birth && ` in ${actor.place_of_birth}`}
                </Typography>
              )}
              
              {actor.deathday && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Died: {new Date(actor.deathday).toLocaleDateString()}
                </Typography>
              )}
              
              {actor.also_known_as && actor.also_known_as.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Also known as:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {actor.also_known_as.map((name: string, index: number) => (
                      <Chip key={index} label={name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - Biography and filmography */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Biography
            </Typography>
            <Typography variant="body1" paragraph>
              {actor.biography || "No biography available."}
            </Typography>
          </Paper>
          
          {credits && credits.cast && credits.cast.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Known For
              </Typography>
              <Grid container spacing={2}>
                {sortedCastCredits.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} key={movie.id}>
                    <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                      <Card sx={{ height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movieImg}
                          alt={movie.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ py: 1 }}>
                          <Typography variant="body2" component="div" noWrap>
                            {movie.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {movie.character && `as ${movie.character}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActorDetailsPage;
