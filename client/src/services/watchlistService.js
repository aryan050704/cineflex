import axios from 'axios';

export const watchlistService = {
  // Get user's watchlist
  getWatchlist: async () => {
    try {
      const response = await axios.get('/api/watchlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  // Add content to watchlist
  addToWatchlist: async (contentId, contentType) => {
    try {
      const response = await axios.post('/api/watchlist', {
        contentId,
        contentType
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  // Remove content from watchlist
  removeFromWatchlist: async (contentId) => {
    try {
      const response = await axios.delete(`/api/watchlist/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  // Check if content is in watchlist
  isInWatchlist: async (contentId) => {
    try {
      const response = await axios.get(`/api/watchlist/check/${contentId}`);
      return response.data.isInWatchlist;
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      throw error;
    }
  }
}; 