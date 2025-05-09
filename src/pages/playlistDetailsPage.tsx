import { useContext, useEffect, useState, useRef } from "react";
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
  CardActions,
  styled,
  Paper,
  Chip,
} from "@mui/material";
import { PlaylistContext } from "../contexts/playlistContext";
import { isAuthenticated } from "../utils/auth";
import { getMovie } from "../api/tmdb-api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import MovieIcon from "@mui/icons-material/Movie";
import img from "../images/film-poster-placeholder.png";

interface PlaylistMovie {
  Order: number;
  AddedDate: string;
  MovieId: number;
}

const PageContainer = styled(Container)({
  marginTop: "2rem",
  marginBottom: "5rem",
  padding: "0 1rem",
});

const HeaderPaper = styled(Paper)({
  backgroundColor: "#0D0D0D",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  padding: "2rem",
  marginBottom: "2rem",
  border: "1px solid #333333",
  backgroundImage: "linear-gradient(to bottom, #1A1A1A, #0D0D0D)",
});

const PageTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  marginBottom: "1rem",
  borderBottom: "2px solid #E50914",
  paddingBottom: "0.5rem",
  display: "inline-block",
});

const Description = styled(Typography)({
  color: "#CCCCCC",
  marginBottom: "1.5rem",
});

const InfoChip = styled(Chip)({
  backgroundColor: "rgba(229, 9, 20, 0.1)",
  color: "#FFFFFF",
  margin: "0.5rem 0.5rem 0.5rem 0",
  border: "1px solid rgba(229, 9, 20, 0.3)",
  "& .MuiChip-icon": {
    color: "#E50914",
  },
});

const BackButton = styled(Button)({
  color: "#FFFFFF",
  borderColor: "#333333",
  marginRight: "1rem",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#FFFFFF",
  },
});

const ActionButton = styled(Button)({
  backgroundColor: "#E50914",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#B2070F",
    boxShadow: "0 4px 8px rgba(229, 9, 20, 0.4)",
  },
  transition: "all 0.3s ease",
});

const MovieCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#1A1A1A",
  color: "#FFFFFF",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  border: "1px solid #333333",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
  },
});

const MovieTitle = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const MovieInfo = styled(Typography)({
  color: "#CCCCCC",
});

const WatchButton = styled(Button)({
  backgroundColor: "#E50914",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#B2070F",
  },
  transition: "all 0.3s ease",
});

const EmptyStateBox = styled(Box)({
  textAlign: "center",
  margin: "4rem 0",
  padding: "3rem",
  backgroundColor: "rgba(26, 26, 26, 0.7)",
  borderRadius: "8px",
  border: "1px solid #333333",
});

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const playlistId = Number(id);
  const navigate = useNavigate();
  const {
    playlists,
    isLoading: playlistsLoading,
    error: playlistsError,
    loadPlaylists,
  } = useContext(PlaylistContext);
  const [playlist, setPlaylist] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

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

  useEffect(() => {
    if (!playlistsLoading && playlists.length > 0) {
      const currentPlaylist = playlists.find((p) => p.Id === playlistId);
      if (currentPlaylist) {
        setPlaylist(currentPlaylist);

        if (
          Array.isArray(currentPlaylist.Movies) &&
          currentPlaylist.Movies.length > 0
        ) {
          const fetchMovies = async () => {
            setIsLoading(true);

            const moviePromises = currentPlaylist.Movies.map(
              async (movieItem: PlaylistMovie | number) => {
                const movieId =
                  typeof movieItem === "object" ? movieItem.MovieId : movieItem;

                try {
                  console.log(`Fetching movie with ID: ${movieId}`);
                  const movieData = await getMovie(movieId.toString());
                  return movieData;
                } catch (err) {
                  console.error(`Failed to fetch movie ${movieId}:`, err);
                  return null;
                }
              }
            );

            const movieResults = await Promise.all(moviePromises);
            const validMovies = movieResults.filter((movie) => movie !== null);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: "#E50914" }} />
      </Box>
    );
  }

  if (error || playlistsError) {
    return (
      <PageContainer maxWidth="md">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || playlistsError}
        </Alert>
        <BackButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToPlaylists}
        >
          Back to Playlists
        </BackButton>
      </PageContainer>
    );
  }

  if (!playlist) {
    return (
      <PageContainer maxWidth="md">
        <Alert severity="warning">Playlist not found</Alert>
        <BackButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToPlaylists}
          sx={{ mt: 2 }}
        >
          Back to Playlists
        </BackButton>
      </PageContainer>
    );
  }

  const movieCount = Array.isArray(playlist.Movies)
    ? playlist.Movies.length
    : 0;

  return (
    <PageContainer maxWidth="lg">
      <HeaderPaper elevation={3}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <BackButton
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToPlaylists}
          >
            Back to Playlists
          </BackButton>

          <ActionButton variant="contained" onClick={handleBackToUpcoming}>
            Browse Upcoming Movies
          </ActionButton>
        </Box>

        <PageTitle variant="h4">{playlist.Title}</PageTitle>

        {playlist.Description && (
          <Description variant="body1" paragraph>
            {playlist.Description}
          </Description>
        )}

        <Box sx={{ mt: 2 }}>
          <InfoChip icon={<MovieIcon />} label={`${movieCount} movies`} />
          {playlist.CreatedDate && (
            <InfoChip
              icon={<CalendarTodayIcon />}
              label={`Created: ${new Date(
                playlist.CreatedDate
              ).toLocaleDateString()}`}
            />
          )}
          {playlist.UpdatedDate && (
            <InfoChip
              icon={<UpdateIcon />}
              label={`Updated: ${new Date(
                playlist.UpdatedDate
              ).toLocaleDateString()}`}
            />
          )}
        </Box>
      </HeaderPaper>

      {movies.length === 0 ? (
        <EmptyStateBox>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
            This playlist is empty
          </Typography>
          <Typography variant="body2" sx={{ color: "#CCCCCC", mb: 3 }}>
            Add movies to this playlist from the movie details page
          </Typography>
          <ActionButton variant="contained" onClick={handleBackToUpcoming}>
            Browse Upcoming Movies
          </ActionButton>
        </EmptyStateBox>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard>
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
                  <MovieTitle gutterBottom variant="h6">
                    {movie.title}
                  </MovieTitle>
                  <MovieInfo variant="body2">
                    {movie.release_date?.substring(0, 4)}
                    {movie.vote_average
                      ? ` • ${movie.vote_average.toFixed(1)}/10`
                      : ""}
                  </MovieInfo>
                </CardContent>
                <CardActions>
                  <WatchButton
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    fullWidth
                    startIcon={<PlayArrowIcon />}
                  >
                    Watch Movie
                  </WatchButton>
                </CardActions>
              </MovieCard>
            </Grid>
          ))}{" "}
        </Grid>
      )}
    </PageContainer>
  );
};
export default PlaylistDetailsPage;
