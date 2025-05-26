import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Link,
  CircularProgress,
  Alert,
  ListItemIcon,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogContent
} from '@mui/material';
import YouTube from 'react-youtube';
import axios from 'axios';
import { format } from 'date-fns';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LinkIcon from '@mui/icons-material/Link';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import {
  PlayArrow as PlayIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  LocalMovies as TicketIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import tmdbService from '../services/tmdbService';
import { useAuth } from '../context/AuthContext';
import { watchlistService } from '../services/watchlistService';
import ContentCard from './ContentCard';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [wikipediaUrl, setWikipediaUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [providers, setProviders] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Movie ID is required');
        }

        const data = await tmdbService.getContentDetails(id, 'movie');
        setMovie(data);

        // Get trailer
        if (data.videos?.results) {
          const trailer = data.videos.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }

        // Get Wikipedia URL
        if (data.title) {
          try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(data.title)}&format=json&origin=*`);
            const wikiData = await response.json();
            const pages = wikiData.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pageId !== '-1') {
              setWikipediaUrl(`https://en.wikipedia.org/?curid=${pageId}`);
            }
          } catch (err) {
            console.error('Error fetching Wikipedia data:', err);
          }
        }

        // Get similar content
        if (data.similar?.results) {
          setSimilarContent(data.similar.results.slice(0, 4));
        }

        // Check if movie is in watchlist
        if (user) {
          const isInWatchlist = await watchlistService.isInWatchlist(id);
          setInWatchlist(isInWatchlist);
        }

        // Fetch comments
        try {
          const response = await axios.get(`/api/movies/${id}/comments`);
          setComments(response.data);
        } catch (err) {
          console.error('Error fetching comments:', err);
        }
      } catch (err) {
        console.error('Error in fetchMovieDetails:', err);
        setError(err.message || 'Error fetching movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, user]);

  const handlePlay = () => {
    if (trailerKey) {
      setTrailerOpen(true);
    }
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
  };

  const handleAddToWatchlist = async () => {
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(id);
      } else {
        await watchlistService.addToWatchlist(id);
      }
      setInWatchlist(!inWatchlist);
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  const handleAddToHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.post(`/api/history/${id}`, {}, config);
    } catch (err) {
      console.error('Error adding to history:', err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const response = await axios.post(
        `/api/movies/${id}/comments`,
        { text: comment, rating: userRating },
        config
      );
      setComments(response.data);
      setComment('');
      setUserRating(0);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Error adding comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Movie not found
        </Alert>
      </Container>
    );
  }

  const getAgeRating = () => {
    if (!movie.release_dates?.results) return 'Not Rated';
    
    const usRelease = movie.release_dates.results.find(
      release => release.iso_3166_1 === 'US'
    );
    
    if (usRelease?.release_dates?.[0]?.certification) {
      return usRelease.release_dates[0].certification;
    }
    
    return 'Not Rated';
  };

  const youtubeId = movie.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube')?.key;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '100%', height: 'auto' }}
            />
            {trailerKey && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <IconButton
                  onClick={handlePlay}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <PlayIcon sx={{ fontSize: 60 }} />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {movie.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<TicketIcon />}
              label={`Age Rating: ${getAgeRating()}`}
              color="primary"
              sx={{ mr: 1 }}
            />
            {wikipediaUrl && (
              <Chip
                icon={<InfoIcon />}
                label="Wikipedia"
                color="secondary"
                component={Link}
                href={wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                sx={{ mr: 1 }}
              />
            )}
          </Box>

          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Release Date: {new Date(movie.release_date).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Rating: {movie.vote_average.toFixed(1)}/10
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Genres:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} />
              ))}
            </Box>
          </Box>

          {user && (
            <Button
              variant="contained"
              color={inWatchlist ? 'secondary' : 'primary'}
              onClick={handleAddToWatchlist}
              sx={{ mr: 2 }}
            >
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={trailerOpen}
        onClose={handleCloseTrailer}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
          <IconButton
            onClick={handleCloseTrailer}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {trailerKey && (
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>

      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Trailer" />
          <Tab label="Comments" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Box>
              {trailerKey ? (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <YouTube
                    videoId={trailerKey}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0
                      },
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
              ) : (
                <Alert severity="info">No trailer available</Alert>
              )}
            </Box>
          )}
          {activeTab === 1 && (
            <Box>
              {user ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Add a Comment
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your comment..."
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography component="legend">Your Rating:</Typography>
                      <Rating
                        value={userRating}
                        onChange={(e, newValue) => setUserRating(newValue)}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      startIcon={<CommentIcon />}
                    >
                      Post Comment
                    </Button>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please log in to add comments
                </Alert>
              )}
              <List>
                {comments.map((comment) => (
                  <React.Fragment key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{comment.user.username[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography component="span" variant="subtitle1">
                              {comment.user.username}
                            </Typography>
                            {comment.rating && (
                              <Rating
                                value={comment.rating}
                                readOnly
                                size="small"
                                sx={{ ml: 2 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {comment.text}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Streaming Providers */}
      {providers && providers.results && providers.results.US && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Where to Watch
          </Typography>
          <Grid container spacing={2}>
            {providers.results.US.flatrate && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Streaming Services
                  </Typography>
                  <List>
                    {providers.results.US.flatrate.map((provider) => (
                      <ListItem key={provider.provider_id}>
                        <ListItemIcon>
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            style={{ width: 50, height: 50, objectFit: 'contain' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={provider.provider_name} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
            {providers.results.US.rent && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Rent or Buy
                  </Typography>
                  <List>
                    {providers.results.US.rent.map((provider) => (
                      <ListItem key={provider.provider_id}>
                        <ListItemIcon>
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            style={{ width: 50, height: 50, objectFit: 'contain' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={provider.provider_name} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Similar Content */}
      {similarContent.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Similar Movies
          </Typography>
          <Grid container spacing={3}>
            {similarContent.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <ContentCard content={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MovieDetails; 