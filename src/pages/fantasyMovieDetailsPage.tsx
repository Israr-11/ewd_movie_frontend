import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { useFantasyMovies } from "../hooks/useFantasyMovies";
import { isAuthenticated } from "../utils/auth";
import { CastMember } from "../api/fantasy-movies-api";
import toast from "../utils/toastService";

const FantasyMovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const navigate = useNavigate();

  const { movies, isLoading, error, loadMovies, removeMovie, addCastToMovie } =
    useFantasyMovies();
  const [movie, setMovie] = useState<any>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCast, setNewCast] = useState<CastMember>({
    Name: "",
    Role: "",
    Description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    loadMovies();
  }, [navigate, loadMovies]);

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      const foundMovie = movies.find((m) => m.Id === movieId);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [movies, movieId, isLoading]);

  const handleDelete = async () => {
    if (!movie) return;

    if (window.confirm(`Are you sure you want to delete "${movie.Title}"?`)) {
      try {
        await removeMovie(movieId);
        toast.success(`"${movie.Title}" has been deleted`);
        navigate("/fantasy-movies");
      } catch (err) {
        toast.error(
          `Failed to delete movie: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    }
  };

  const handleAddCast = async () => {
    if (!movie) return;

    if (!newCast.Name.trim() || !newCast.Role.trim()) {
      toast.error("Name and Role are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await addCastToMovie(movieId, newCast);

      setNewCast({ Name: "", Role: "", Description: "" });
      setDialogOpen(false);

      toast.success("Cast member added successfully");
    } catch (err) {
      toast.error(
        `Failed to add cast member: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/fantasy-movies")}
          color="error"
        >
          Back to Fantasy Movies
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" color="error" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Fantasy movie not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/fantasy-movies")}
          color="error"
        >
          Back to Fantasy Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" color="error" sx={{ mb: 10, color: "red" }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/fantasy-movies")}
          color="error"
        >
          Back to Fantasy Movies
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={movie.PosterUrl || "/placeholder-poster.jpg"}
              alt={movie.Title}
              sx={{ height: 500, objectFit: "cover" }}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                {movie.Genres.map((genre: string) => (
                  <Chip key={genre} label={genre} size="small" />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Release Date: {new Date(movie.ReleaseDate).toLocaleDateString()}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Runtime: {movie.Runtime} minutes
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Production Companies:
              </Typography>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
              >
                {movie.ProductionCompanies.map((company: string) => (
                  <Chip
                    key={company}
                    label={company}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                fullWidth
                sx={{ mt: 3 }}
              >
                Delete Movie
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.Title}
            </Typography>

            <Typography variant="body1" paragraph>
              {movie.Overview}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Created on: {new Date(movie.CreatedDate).toLocaleDateString()}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h2">
                Cast
              </Typography>

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                color="error"
                onClick={() => setDialogOpen(true)}
              >
                Add Cast Member
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {movie.Cast.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                No cast members added yet. Add your first cast member!
              </Typography>
            ) : (
              <List>
                {movie.Cast.map((castMember: CastMember, index: number) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider variant="inset" component="li" />}
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "baseline" }}>
                            <Typography
                              component="span"
                              variant="subtitle1"
                              sx={{ mr: 1 }}
                            >
                              {castMember.Name}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              as {castMember.Role}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          castMember.Description || "No description provided"
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Cast Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={newCast.Name}
            onChange={(e) => setNewCast({ ...newCast, Name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={newCast.Role}
            onChange={(e) => setNewCast({ ...newCast, Role: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newCast.Description}
            onChange={(e) =>
              setNewCast({ ...newCast, Description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddCast}
            variant="contained"
            color="error"
            disabled={
              isSubmitting || !newCast.Name.trim() || !newCast.Role.trim()
            }
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FantasyMovieDetailsPage;
