import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import ContentCard from './ContentCard';
import MovieCarousel from './MovieCarousel';
import InfiniteScroll from 'react-infinite-scroll-component';
import tmdbService from '../services/tmdbService';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      
      const [
        trendingData,
        popularMoviesData,
        popularTVShowsData,
        topRatedMoviesData,
        topRatedTVShowsData,
        upcomingMoviesData
      ] = await Promise.all([
        tmdbService.getTrendingMovies(),
        fetch(`${tmdbService.BASE_URL}/movie/popular?api_key=${tmdbService.API_KEY}&page=${pageNum}`).then(res => res.json()),
        fetch(`${tmdbService.BASE_URL}/tv/popular?api_key=${tmdbService.API_KEY}&page=${pageNum}`).then(res => res.json()),
        fetch(`${tmdbService.BASE_URL}/movie/top_rated?api_key=${tmdbService.API_KEY}&page=${pageNum}`).then(res => res.json()),
        fetch(`${tmdbService.BASE_URL}/tv/top_rated?api_key=${tmdbService.API_KEY}&page=${pageNum}`).then(res => res.json()),
        fetch(`${tmdbService.BASE_URL}/movie/upcoming?api_key=${tmdbService.API_KEY}&page=${pageNum}`).then(res => res.json())
      ]);

      if (append) {
        setPopularMovies(prev => [...prev, ...(popularMoviesData.results || [])]);
        setPopularTVShows(prev => [...prev, ...(popularTVShowsData.results || [])]);
        setTopRatedMovies(prev => [...prev, ...(topRatedMoviesData.results || [])]);
        setTopRatedTVShows(prev => [...prev, ...(topRatedTVShowsData.results || [])]);
        setUpcomingMovies(prev => [...prev, ...(upcomingMoviesData.results || [])]);
      } else {
        setTrending(trendingData);
        setPopularMovies(popularMoviesData.results || []);
        setPopularTVShows(popularTVShowsData.results || []);
        setTopRatedMovies(topRatedMoviesData.results || []);
        setTopRatedTVShows(topRatedTVShowsData.results || []);
        setUpcomingMovies(upcomingMoviesData.results || []);
      }

      setHasMore(
        popularMoviesData.page < popularMoviesData.total_pages &&
        popularTVShowsData.page < popularTVShowsData.total_pages &&
        topRatedMoviesData.page < topRatedMoviesData.total_pages &&
        topRatedTVShowsData.page < topRatedTVShowsData.total_pages &&
        upcomingMoviesData.page < upcomingMoviesData.total_pages
      );

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  const renderContent = (items, title) => (
    <Box sx={{ mb: 6 }}>
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
        {title}
      </Typography>
      <InfiniteScroll
        dataLength={items.length}
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
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ContentCard content={item} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );

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
      {/* Movie Carousel */}
      {trending.length > 0 && (
        <Box sx={{ mt: 2, mb: 6 }}>
          <MovieCarousel movies={trending.slice(0, 5)} />
        </Box>
      )}

      {/* Content Sections */}
      {renderContent(popularMovies, 'Popular Movies')}
      {renderContent(popularTVShows, 'Popular TV Shows')}
      {renderContent(topRatedMovies, 'Top Rated Movies')}
      {renderContent(topRatedTVShows, 'Top Rated TV Shows')}
      {renderContent(upcomingMovies, 'Upcoming Movies')}
    </Container>
  );
};

export default Home; 