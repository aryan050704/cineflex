import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import YouTube from 'react-youtube';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`/api/movies/${id}`, config);
        setMovie(res.data);
        
        // Add movie to watch history
        await axios.post(`/api/history/${id}`, { title: res.data.title }, config);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBookTickets = () => {
    window.open(movie.bookMyShowLink, '_blank');
  };

  const handleWikipedia = () => {
    window.open(movie.wikipediaLink, '_blank');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container>
        <Typography color="error">{error || 'Movie not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={movie.rating / 2} precision={0.5} readOnly />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {movie.rating}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              {movie.genre.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Release Date: {movie.releaseDate}
              </Typography>
              <Typography variant="subtitle1">
                Duration: {movie.duration}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBookTickets}
              >
                Book Tickets
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleWikipedia}
              >
                View on Wikipedia
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Trailer
            </Typography>
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <YouTube
                videoId={movie.youtubeTrailer.split('v=')[1]}
                opts={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetails; 