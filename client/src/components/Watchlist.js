import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  useTheme,
  Chip,
  Tooltip
} from '@mui/material';
import { Delete, PlayArrow, BookmarkRemove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { watchlistService } from '../services/watchlistService';
import { contentService } from '../services/contentService';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const watchlistData = await watchlistService.getWatchlist();
      setWatchlist(watchlistData);
      setError(null);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to load watchlist. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (contentId) => {
    try {
      await watchlistService.removeFromWatchlist(contentId);
      setWatchlist(watchlist.filter(item => item.contentId !== contentId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove item from watchlist. Please try again.');
    }
  };

  const handlePlay = (contentId, contentType) => {
    navigate(`/${contentType}/${contentId}`);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Please log in to view your watchlist.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        My Watchlist
      </Typography>

      {watchlist.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Your watchlist is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/browse')}
          >
            Browse Content
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {watchlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.contentId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      label={item.type === 'movie' ? 'Movie' : 'TV Show'}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${item.rating}/10`}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.overview?.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Play">
                    <IconButton
                      color="primary"
                      onClick={() => handlePlay(item.contentId, item.type)}
                    >
                      <PlayArrow />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove from Watchlist">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWatchlist(item.contentId)}
                    >
                      <BookmarkRemove />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Watchlist; 