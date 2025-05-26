import axios from 'axios';

const API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77';
const BASE_URL = 'https://api.themoviedb.org/3';

export const recommendationService = {
  // Get personalized recommendations based on user's watch history and preferences
  getPersonalizedRecommendations: async (userId) => {
    try {
      const response = await axios.get(`/api/recommendations/personalized/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      throw error;
    }
  },

  // Get similar content based on a specific movie/show
  getSimilarContent: async (contentId, contentType = 'movie') => {
    try {
      const response = await axios.get(`${BASE_URL}/${contentType}/${contentId}/similar`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching similar content:', error);
      throw error;
    }
  },

  // Get trending content
  getTrendingContent: async (timeWindow = 'day') => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/all/${timeWindow}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US'
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  },

  // Get content by genre
  getContentByGenre: async (genreId, contentType = 'movie') => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/${contentType}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          with_genres: genreId,
          sort_by: 'popularity.desc'
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching content by genre:', error);
      throw error;
    }
  }
}; 