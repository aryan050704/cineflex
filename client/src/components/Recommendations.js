import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { recommendationService } from '../services/recommendationService';
import ContentCard from './ContentCard';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    fetchRecommendations();
  }, [activeTab]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (activeTab) {
        case 0: // Personalized
          data = await recommendationService.getPersonalizedRecommendations(user.id);
          break;
        case 1: // Trending
          data = await recommendationService.getTrendingContent();
          break;
        case 2: // Similar to your favorites
          // Get user's favorite content and fetch similar content
          const favorites = user.favorites || [];
          if (favorites.length > 0) {
            const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)];
            data = await recommendationService.getSimilarContent(randomFavorite.id, randomFavorite.type);
          } else {
            data = await recommendationService.getTrendingContent();
          }
          break;
        default:
          data = await recommendationService.getTrendingContent();
      }
      
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Recommended for You
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ 
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <Tab label="Personalized" />
        <Tab label="Trending" />
        <Tab label="Similar to Your Favorites" />
      </Tabs>

      <Grid container spacing={3}>
        {recommendations.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <ContentCard content={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations; 