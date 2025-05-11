import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Box,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { PlaylistContext } from "../../contexts/playlistContext";
import { BaseMovieProps } from "../../types/interfaces";
import toast from "../../utils/toastService";

interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  movie: BaseMovieProps;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  open,
  onClose,
  movie,
}) => {
  const {
    playlists,
    isLoading,
    createNewPlaylist,
    addToPlaylist,
    loadPlaylists,
  } = useContext(PlaylistContext);
  const [tabValue, setTabValue] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (open && !hasLoadedRef.current) {
      loadPlaylists();
      hasLoadedRef.current = true;
    }

    if (!open) {
      hasLoadedRef.current = false;
    }
  }, [open, loadPlaylists]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreatePlaylist = async () => {
    if (!title.trim()) {
      toast.error("Please enter a playlist title");
      return;
    }

    try {
      setIsSubmitting(true);
      const newPlaylist = await createNewPlaylist(title, description);

      await addToPlaylist(newPlaylist.Id, movie.id);

      setTitle("");
      setDescription("");

      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToExistingPlaylist = async (playlistId: number) => {
    try {
      setIsSubmitting(true);
      await addToPlaylist(playlistId, movie.id);
      onClose();
    } catch (error) {
      console.error("Error adding to playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onExited: () => {
          setTitle("");
          setDescription("");
          setTabValue(0);
        },
      }}
    >
      <DialogTitle>Add "{movie.title}" to Playlist</DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="playlist options"
        >
          <Tab label="Add to Existing Playlist" />
          <Tab label="Create New Playlist" />
        </Tabs>
      </Box>

      <DialogContent>
        {tabValue === 0 && (
          <>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : playlists.length === 0 ? (
              <Typography variant="body1" sx={{ py: 2 }}>
                You don't have any playlists yet. Create one to add this movie.
              </Typography>
            ) : (
              <List>
                {playlists.map((playlist) => (
                  <React.Fragment key={playlist.Id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleAddToExistingPlaylist(playlist.Id)}
                        disabled={
                          isSubmitting ||
                          (playlist.Movies &&
                            playlist.Movies.includes(movie.id))
                        }
                      >
                        <ListItemText
                          primary={playlist.Title}
                          secondary={
                            playlist.Movies &&
                            playlist.Movies.includes(movie.id)
                              ? "This movie is already in this playlist"
                              : playlist.Description || "No description"
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )}

        {tabValue === 1 && (
          <Box component="form" sx={{ mt: 2 }}>
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
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        {tabValue === 1 && (
          <Button
            onClick={handleCreatePlaylist}
            variant="contained"
            color="error"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Create & Add"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PlaylistModal;
