const axios = require('axios');
const TMDB_CONFIG = require('../config/tmdb');

class TMDBService {
  constructor() {
    this.api = axios.create({
      baseURL: TMDB_CONFIG.baseUrl,
      params: {
        api_key: TMDB_CONFIG.apiKey,
        language: 'en-US'
      }
    });
  }

  async getMovieDetails(movieId) {
    try {
      const response = await this.api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,credits'
        }
      });
      return this.formatMovieData(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getTVShowDetails(tvId) {
    try {
      const response = await this.api.get(`/tv/${tvId}`, {
        params: {
          append_to_response: 'videos,credits'
        }
      });
      return this.formatTVShowData(response.data);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  }

  async searchContent(query, type = 'multi') {
    try {
      const response = await this.api.get(`/search/${type}`, {
        params: { query }
      });
      return response.data.results.map(item => this.formatSearchResult(item));
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }

  async getTopRated(type = 'movie', page = 1) {
    try {
      const response = await this.api.get(`/${type}/top_rated`, {
        params: { page }
      });
      return response.data.results.map(item => this.formatSearchResult(item));
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      throw error;
    }
  }

  formatMovieData(movie) {
    return {
      title: movie.title,
      type: 'movie',
      description: movie.overview,
      poster: `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.poster.large}${movie.poster_path}`,
      backdrop: `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.backdrop.large}${movie.backdrop_path}`,
      rating: movie.vote_average,
      genres: movie.genres.map(genre => genre.name),
      releaseDate: movie.release_date,
      duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
      youtubeTrailer: this.getTrailerUrl(movie.videos),
      bookMyShowLink: `https://in.bookmyshow.com/search/${encodeURIComponent(movie.title)}`,
      wikipediaLink: `https://en.wikipedia.org/wiki/${encodeURIComponent(movie.title)}`,
      cast: movie.credits.cast.slice(0, 5).map(actor => ({
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path ? 
          `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.poster.small}${actor.profile_path}` : 
          null
      }))
    };
  }

  formatTVShowData(show) {
    return {
      title: show.name,
      type: 'tv_show',
      description: show.overview,
      poster: `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.poster.large}${show.poster_path}`,
      backdrop: `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.backdrop.large}${show.backdrop_path}`,
      rating: show.vote_average,
      genres: show.genres.map(genre => genre.name),
      releaseDate: show.first_air_date,
      duration: `${show.episode_run_time[0]}m`,
      youtubeTrailer: this.getTrailerUrl(show.videos),
      seasons: show.seasons.map(season => ({
        seasonNumber: season.season_number,
        episodes: [] // Will be populated when fetching season details
      })),
      cast: show.credits.cast.slice(0, 5).map(actor => ({
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path ? 
          `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.poster.small}${actor.profile_path}` : 
          null
      }))
    };
  }

  formatSearchResult(item) {
    const baseData = {
      id: item.id,
      title: item.title || item.name,
      type: item.media_type || (item.title ? 'movie' : 'tv_show'),
      description: item.overview,
      poster: item.poster_path ? 
        `${TMDB_CONFIG.imageBaseUrl}/${TMDB_CONFIG.imageSizes.poster.medium}${item.poster_path}` : 
        null,
      rating: item.vote_average,
      releaseDate: item.release_date || item.first_air_date
    };

    return baseData;
  }

  getTrailerUrl(videos) {
    if (!videos || !videos.results) return null;
    const trailer = videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  // Get trending content
  async getTrending(timeWindow = 'day') {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/trending/all/${timeWindow}`, {
        params: { api_key: TMDB_CONFIG.apiKey }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/movie/popular`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  // Get popular TV shows
  async getPopularTVShows(page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/tv/popular`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/movie/top_rated`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  // Get top rated TV shows
  async getTopRatedTVShows(page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/tv/top_rated`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/movie/upcoming`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  // Get similar content
  async getSimilarContent(id, type = 'movie', page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/${type}/${id}/similar`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar content:', error);
      throw error;
    }
  }

  // Get recommendations
  async getRecommendations(id, type = 'movie', page = 1) {
    try {
      const response = await axios.get(`${TMDB_CONFIG.baseUrl}/${type}/${id}/recommendations`, {
        params: { api_key: TMDB_CONFIG.apiKey, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  // Get streaming providers for a movie
  async getMovieProviders(movieId) {
    try {
      const response = await axios.get(
        `${TMDB_CONFIG.baseUrl}/movie/${movieId}/watch/providers`,
        {
          params: {
            api_key: TMDB_CONFIG.apiKey,
            language: 'en-US'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching movie providers:', error);
      throw error;
    }
  }

  // Get streaming providers for a TV show
  async getTVShowProviders(tvId) {
    try {
      const response = await axios.get(
        `${TMDB_CONFIG.baseUrl}/tv/${tvId}/watch/providers`,
        {
          params: {
            api_key: TMDB_CONFIG.apiKey,
            language: 'en-US'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show providers:', error);
      throw error;
    }
  }

  // Get content by genre
  async getContentByGenre(genreId, type, page = 1) {
    try {
      const response = await axios.get(
        `${TMDB_CONFIG.baseUrl}/discover/${type}`,
        {
          params: {
            api_key: TMDB_CONFIG.apiKey,
            language: 'en-US',
            with_genres: genreId,
            page: page
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching content by genre:', error);
      throw error;
    }
  }

  // Add getContentDetails function
  async getContentDetails(id, type) {
    try {
      if (type === 'movie') {
        return await this.getMovieDetails(id);
      } else if (type === 'tv') {
        return await this.getTVShowDetails(id);
      } else {
        throw new Error('Invalid content type');
      }
    } catch (error) {
      console.error('Error fetching content details:', error);
      throw error;
    }
  }
}

module.exports = new TMDBService(); 