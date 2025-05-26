import axios from 'axios';

const API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77';
const BASE_URL = 'https://api.themoviedb.org/3';

export const contentService = {
  // Get content details including trailers and reviews
  getContentDetails: async (contentId, contentType = 'movie') => {
    try {
      const response = await axios.get(`${BASE_URL}/${contentType}/${contentId}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          append_to_response: 'videos,reviews,credits'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching content details:', error);
      throw error;
    }
  },

  // Get trailers for a specific content
  getTrailers: async (contentId, contentType = 'movie') => {
    try {
      const response = await axios.get(`${BASE_URL}/${contentType}/${contentId}/videos`, {
        params: {
          api_key: API_KEY,
          language: 'en-US'
        }
      });
      return response.data.results.filter(video => video.type === 'Trailer');
    } catch (error) {
      console.error('Error fetching trailers:', error);
      throw error;
    }
  },

  // Get reviews for a specific content
  getReviews: async (contentId, contentType = 'movie') => {
    try {
      const response = await axios.get(`${BASE_URL}/${contentType}/${contentId}/reviews`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Add a user review
  addReview: async (contentId, review) => {
    try {
      const response = await axios.post(`/api/reviews/${contentId}`, review);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get user reviews for a specific content
  getUserReviews: async (contentId) => {
    try {
      const response = await axios.get(`/api/reviews/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }
}; 