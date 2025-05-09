import React, { useContext, useEffect, useState, useRef } from "react";
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Box,
  Divider,
  Alert,
  styled
} from "@mui/material";
import { PlaylistContext } from "../contexts/playlistContext";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "../utils/toastService";

// Subtle enhancements for existing components
const EnhancedCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
  },
});

const CardTitle = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "0.5rem",
});

const CardMovieCount = styled(Typography)({
  color: "#E50914",
  fontWeight: "bold",
});

const EnhancedDivider = styled(Divider)({
  margin: "0.75rem 0",
  opacity: 0.7,
});

const ViewButton = styled(Button)({
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const DeleteButton = styled(Button)({
  color: "#E50914",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
});

const CreateButton = styled(Button)({
  backgroundColor: "#E50914",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#B2070F",
  },
});

const PlaylistsPage = () => {
  const { playlists, isLoading, error, loadPlaylists, createNewPlaylist, removePlaylist } = useContext(PlaylistContext);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    
    // Only load playlists once
    if (!hasLoadedRef.current && !isLoading) {
      loadPlaylists();
      hasLoadedRef.current = true;
    }
  }, [navigate]); // Remove loadPlaylists from dependencies

  const handleCreatePlaylist = async () => {
    if (!title.trim()) {
      toast.error("Please enter a playlist title");
      return;
    }

    try {
      setIsSubmitting(true);
      await createNewPlaylist(title, description);
      
      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: number, playlistTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the playlist "${playlistTitle}"?`)) {
      try {
        await removePlaylist(playlistId);
      } catch (error) {
        console.error("Error deleting playlist:", error);
      }
    }
  };

  const handleViewPlaylist = (playlistId: number) => {
    navigate(`/movies/playlists/${playlistId}`);
  };

  if (isLoading && playlists.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: "#E50914" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Playlists
        </Typography>
        <CreateButton 
          variant="contained" 
          color="error" 
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create New Playlist
        </CreateButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {playlists.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="40vh"
          textAlign="center"
          sx={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", p: 3, borderRadius: 1 }}
        >
          <Typography variant="h6" gutterBottom>
            You don't have any playlists yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Create your first playlist to start organizing your must watch movies!
          </Typography>
          <CreateButton 
            variant="contained" 
            color="error" 
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Playlist
          </CreateButton>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist.Id}>
              <EnhancedCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <CardTitle variant="h5">
                    {playlist.Title}
                  </CardTitle>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {playlist.Description || "No description"}
                  </Typography>
                  <EnhancedDivider />
                  <CardMovieCount variant="body2">
                    {playlist.Movies?.length || 0} movies
                  </CardMovieCount>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(playlist.CreatedDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <ViewButton 
                    size="small" 
                    onClick={() => handleViewPlaylist(playlist.Id)}
                  >
                    View
                  </ViewButton>
                  <DeleteButton 
                    size="small" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeletePlaylist(playlist.Id, playlist.Title)}
                  >
                    Delete
                  </DeleteButton>
                </CardActions>
              </EnhancedCard>
            </Grid>
          ))}        </Grid>
      )}

      {/* Create Playlist Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          }
        }}
        TransitionProps={{
          onExited: () => {
            // Reset form state when dialog is fully closed
            setTitle("");
            setDescription("");
          }
        }}
      >
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="playlist-title"
            label="Playlist Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="playlist-description"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)} 
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <CreateButton 
            onClick={handleCreatePlaylist} 
            variant="contained" 
            color="error"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Create Playlist"}
          </CreateButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlaylistsPage;
