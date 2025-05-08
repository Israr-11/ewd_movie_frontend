import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Rating, 
  Divider, 
  CircularProgress, 
  Alert,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getUserReviews } from '../../api/review-api';
import { getMovie } from '../../api/tmdb-api';
import { useQuery } from 'react-query';

interface ReviewsModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

interface Review {
  MovieId: number;
  ReviewId: number;
  ReviewerEmail: string;
  UserId: string;
  Rating: number;
  Content: string;
  ReviewDate: string;
}

interface ReviewWithMovie extends Review {
  movieTitle?: string;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ open, onClose }) => {
    const userId= localStorage.getItem("user_id") || undefined;
    const [reviews, setReviews] = useState<ReviewWithMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log("ReviewsModal opened:", open, userId);
    // Fetch reviews when the modal opens
    useEffect(() => {
      if (open && userId) {
        fetchReviews();
      }
    }, [open, userId]);
  
    const fetchReviews = async () => {
      if (!userId) {
        console.error("No userId provided to fetchReviews");
        setError("User ID is required to fetch reviews");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching reviews for user:", userId);
        const reviewsData = await getUserReviews(userId);
        console.log("Reviews data received:", reviewsData);
        
        if (!reviewsData || reviewsData.length === 0) {
          console.log("No reviews found for user");
          setReviews([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch movie titles for each review
        const reviewsWithMovies = await Promise.all(
          reviewsData.map(async (review: Review) => {
            try {
              const movie = await getMovie(review.MovieId.toString());
              return {
                ...review,
                movieTitle: movie.title
              };
            } catch (err) {
              console.error(`Failed to fetch movie ${review.MovieId}:`, err);
              return {
                ...review,
                movieTitle: `Movie ID: ${review.MovieId}`
              };
            }
          })
        );
        
        console.log("Reviews with movies:", reviewsWithMovies);
        setReviews(reviewsWithMovies);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">My Movie Reviews</Typography>
            <Button onClick={onClose} color="inherit">
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : !userId ? (
            <Alert severity="warning">User ID is required to view reviews</Alert>
          ) : reviews.length === 0 ? (
            <Typography variant="body1" align="center" p={3}>
              You haven't written any reviews yet.
            </Typography>
          ) : (
            reviews.map((review) => (
              <Paper key={review.ReviewId} elevation={2} sx={{ mb: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {review.movieTitle || `Movie ID: ${review.MovieId}`}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={review.Rating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    {review.Rating}/5
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {review.Content}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Reviewed on {formatDate(review.ReviewDate)}
                </Typography>
              </Paper>
            ))
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  

export default ReviewsModal;
