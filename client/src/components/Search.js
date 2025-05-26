import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Popper,
  ClickAwayListener,
  Rating,
  Chip
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Movie as MovieIcon, Tv as TvIcon } from '@mui/icons-material';
import ContentCard from './ContentCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { searchService } from '../services/searchService';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchType, setSearchType] = useState('all');
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback(
    (term, pageNum = 1, type = searchType) => {
      const timeoutId = setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);

          let response;
          if (type === 'all') {
            response = await searchService.searchContent(term, 'multi', pageNum);
          } else if (type === 'movie') {
            response = await searchService.searchMovies(term, pageNum);
          } else if (type === 'tv') {
            response = await searchService.searchTVShows(term, pageNum);
          }

          const newResults = response.results.filter(item => 
            item.media_type !== 'person' && item.poster_path
          );

          if (pageNum === 1) {
            setResults(newResults);
            // Get recommendations for the first result if available
            if (newResults.length > 0) {
              const firstResult = newResults[0];
              const recs = await searchService.getRecommendations(
                firstResult.id,
                firstResult.media_type || (firstResult.title ? 'movie' : 'tv')
              );
              setRecommendations(recs);
            }
          } else {
            setResults(prev => [...prev, ...newResults]);
          }

          setTotalResults(response.total_results);
          setHasMore(pageNum < response.total_pages);
          setPage(pageNum);
        } catch (err) {
          setError('Error fetching search results. Please try again.');
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    [searchType]
  );

  // Handle input changes
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setShowSuggestions(true);
      try {
        const suggestions = await searchService.getSuggestions(value);
        setSuggestions(suggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    navigate(`/${suggestion.type}/${suggestion.id}`);
  };

  // Handle search type change
  const handleTypeChange = (event, newValue) => {
    setSearchType(newValue);
    setPage(1);
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, 1, newValue);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setHasMore(false);
    setTotalResults(0);
    setSuggestions([]);
    setShowSuggestions(false);
    setRecommendations([]);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      debouncedSearch(searchTerm, page + 1);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for movies, TV shows, actors, or directors..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            inputRef={searchInputRef}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Popper
            open={showSuggestions && suggestions.length > 0}
            anchorEl={searchInputRef.current}
            placement="bottom-start"
            style={{ width: searchInputRef.current?.offsetWidth, zIndex: 1300 }}
          >
            <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
              <Paper elevation={3}>
                <List>
                  {suggestions.map((suggestion) => (
                    <ListItem
                      key={suggestion.id}
                      button
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={`https://image.tmdb.org/t/p/w92${suggestion.poster}`}
                          alt={suggestion.title}
                        >
                          {suggestion.type === 'movie' ? <MovieIcon /> : <TvIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={suggestion.title}
                        secondary={suggestion.type === 'movie' ? 'Movie' : 'TV Show'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
        <Tabs
          value={searchType}
          onChange={handleTypeChange}
          sx={{ mb: 3 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Movies" value="movie" />
          <Tab label="TV Shows" value="tv" />
        </Tabs>
        {searchTerm && totalResults > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {totalResults} results for "{searchTerm}"
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && page === 1 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <InfiniteScroll
            dataLength={results.length}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            }
            endMessage={
              <Typography variant="body1" textAlign="center" my={4}>
                {results.length === 0 && searchTerm
                  ? 'No results found. Try a different search term.'
                  : searchTerm
                  ? 'No more results to load.'
                  : 'Start searching to see results.'}
              </Typography>
            }
          >
            <Grid container spacing={3}>
              {results.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <ContentCard
                    id={item.id}
                    title={item.title || item.name}
                    posterPath={item.poster_path}
                    type={item.media_type || (item.title ? 'movie' : 'tv')}
                    rating={item.vote_average}
                    overview={item.overview}
                    releaseDate={item.release_date || item.first_air_date}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>

          {recommendations.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom>
                Recommended Based on Your Search
              </Typography>
              <Grid container spacing={3}>
                {recommendations.slice(0, 4).map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.id}>
                    <ContentCard
                      id={item.id}
                      title={item.title || item.name}
                      posterPath={item.poster_path}
                      type={item.media_type || (item.title ? 'movie' : 'tv')}
                      rating={item.vote_average}
                      overview={item.overview}
                      releaseDate={item.release_date || item.first_air_date}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Search; 