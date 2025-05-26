import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import ContentCard from './ContentCard';
import InfiniteScroll from 'react-infinite-scroll-component';

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTrending = async (pageNum = 1, append = false) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const response = await axios.get(`/api/movies/trending?page=${pageNum}`, config);
      
      if (append) {
        setTrending(prev => [...prev, ...response.data.results]);
      } else {
        setTrending(response.data.results);
      }

      setHasMore(response.data.page < response.data.total_pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching trending:', err);
      setError(err.response?.data?.msg || 'Error fetching trending content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrending(nextPage, true);
  };

  if (loading && page === 1) {
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
        Trending Now
      </Typography>

      <InfiniteScroll
        dataLength={trending.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Box textAlign="center" my={4}>
            <Typography variant="body1" color="textSecondary">
              No more content to load
            </Typography>
          </Box>
        }
      >
        <Grid container spacing={3}>
          {trending.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ContentCard content={item} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default Trending; 