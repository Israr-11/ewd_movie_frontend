import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMovie } from "../api/tmdb-api";
import { submitReview } from "../api/review-api";
import { isAuthenticated } from "../utils/auth";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar 
} from "@mui/material";
import toast from "../utils/toastService";


const AddMovieReviewPage = () => {
  const [movie, setMovie] = useState<any>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract movieId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("movieId");
  
  // Fetch movie details
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    
    if (!movieId) {
      setError("No movie ID provided");
      return;
    }
    
    setIsLoading(true);
    getMovie(movieId)
      .then(data => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError("Failed to load movie details");
        setIsLoading(false);
        console.error(err);
      });
  }, [movieId, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movieId) {
      setError("No movie ID provided");
      return;
    }
    
    if (review.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submitReview(parseInt(movieId), review, rating);
      import("../utils/toastService").then(({ showSuccess }) => {
        showSuccess("Review submitted successfully!");
      });      
      setSuccess(true);
      
      // Reset form
      setReview("");
      setRating(3);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
      import("../utils/toastService").then(({ showError }) => {
        showError(err instanceof Error ? err.message : "Failed to submit review");
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && !movie) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write a Review
        </Typography>
        
        {movie && (
          <Typography variant="h5" component="h2" gutterBottom>
            {movie.title}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 3)}
              size="large"
              precision={1}
            />
          </Box>
          
          <TextField
            label="Your Review"
            multiline
            rows={6}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            placeholder="Share your thoughts about the movie..."
            error={!!error && error.includes("Review")}
            helperText={error && error.includes("Review") ? error : ""}
          />
          
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit Review"}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar 
        open={success} 
        autoHideDuration={2000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Review submitted successfully!</Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error && !error.includes("Review")} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMovieReviewPage;
