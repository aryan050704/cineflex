import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Rating,
  Divider,
  CircularProgress,
  useTheme,
  IconButton,
  Dialog,
  DialogContent
} from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { contentService } from '../services/contentService';

const ContentDetails = ({ contentId, contentType = 'movie' }) => {
  const [content, setContent] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    fetchContentDetails();
  }, [contentId, contentType]);

  const fetchContentDetails = async () => {
    try {
      setLoading(true);
      const [contentData, trailersData, reviewsData] = await Promise.all([
        contentService.getContentDetails(contentId, contentType),
        contentService.getTrailers(contentId, contentType),
        contentService.getReviews(contentId, contentType)
      ]);

      setContent(contentData);
      setTrailers(trailersData);
      setReviews(reviewsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching content details:', err);
      setError('Failed to load content details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await contentService.addReview(contentId, {
        ...userReview,
        userId: user.id,
        contentId,
        contentType
      });
      // Refresh reviews after adding new one
      const updatedReviews = await contentService.getReviews(contentId, contentType);
      setReviews(updatedReviews);
      setUserReview({ rating: 0, comment: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Content Header */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${content?.poster_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {content?.title || content?.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {content?.overview}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rating: {content?.vote_average}/10
            </Typography>
            <Typography variant="subtitle1">
              Release Date: {content?.release_date || content?.first_air_date}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Trailers Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Trailers
        </Typography>
        <Grid container spacing={2}>
          {trailers.map((trailer) => (
            <Grid item xs={12} sm={6} md={4} key={trailer.id}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => setSelectedTrailer(trailer)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlayArrow />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    {trailer.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>

        {/* Add Review Form */}
        {user && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleReviewSubmit}>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Your Rating</Typography>
                <Rating
                  value={userReview.rating}
                  onChange={(event, newValue) => {
                    setUserReview({ ...userReview, rating: newValue });
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                value={userReview.comment}
                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </form>
          </Paper>
        )}

        {/* Reviews List */}
        {reviews.map((review) => (
          <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">
                {review.author}
              </Typography>
              <Rating value={review.rating} readOnly />
            </Box>
            <Typography variant="body2">{review.content}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Trailer Dialog */}
      <Dialog
        open={Boolean(selectedTrailer)}
        onClose={() => setSelectedTrailer(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedTrailer(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          {selectedTrailer && (
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
              title={selectedTrailer.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ContentDetails; 