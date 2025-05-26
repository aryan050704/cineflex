import axios from 'axios';

const API_KEY = '8c247ea0b4b56ed2ff7d41c9a833aa77';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchService = {
  // Search for movies and TV shows
  searchContent: async (query, type = 'multi', page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/${type}`, {
        params: {
          api_key: API_KEY,
          query,
          page,
          language: 'en-US',
          include_adult: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },

  // Search movies only
  searchMovies: async (query, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query,
          page,
          language: 'en-US',
          include_adult: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Search TV shows only
  searchTVShows: async (query, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/tv`, {
        params: {
          api_key: API_KEY,
          query,
          page,
          language: 'en-US',
          include_adult: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  }
}; 