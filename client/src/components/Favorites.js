import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import ContentCard from './ContentCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        const response = await axios.get('/api/favorites', config);
        setFavorites(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(err.response?.data?.msg || 'Error fetching favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          mb: 3,
          color: 'primary.main',
        }}
      >
        My Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            You haven't added any favorites yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ContentCard content={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 