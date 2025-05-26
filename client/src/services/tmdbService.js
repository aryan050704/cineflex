/**
 * Custom TMDB API Service
 * Created with ❤️ by Aryan
 * A powerful service to interact with The Movie Database API
 */

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Custom error class for TMDB API errors
class TMDBError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TMDBError';
    this.status = status;
  }
}

const tmdbService = {
  // Fetch trending movies with custom error handling
  async getTrendingMovies() {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new TMDBError('Failed to fetch trending movies', response.status);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Search movies with enhanced error handling
  async searchMovies(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new TMDBError('Failed to search movies', response.status);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details with custom error handling
  async getMovieDetails(movieId) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new TMDBError('Failed to fetch movie details', response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get movie credits with custom error handling
  async getMovieCredits(movieId) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new TMDBError('Failed to fetch movie credits', response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  }
};

export default tmdbService; 