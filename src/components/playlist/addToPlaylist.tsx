import React, { useState } from "react";
import { Button } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { BaseMovieProps } from "../../types/interfaces";
import { isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./playlistModal";

const AddToPlaylist: React.FC<BaseMovieProps> = ({ ...movie }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    
    setModalOpen(true);
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="primary"
        startIcon={<PlaylistAddIcon />}
        onClick={handleClick}
      >
        Add to Playlist
      </Button>
      
      {modalOpen && (
        <PlaylistModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          movie={movie}
        />
      )}
    </>
  );
};

export default AddToPlaylist;
