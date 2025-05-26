const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const { TMDB_API_KEY, TMDB_API_URL } = require('../config/keys');
const Content = require('../models/Content');

// Search content with enhanced functionality
router.get('/search', auth, async (req, res) => {
  try {
    const { query, type = 'multi', page = 1, genre, person } = req.query;
    
    if (!query && !genre && !person) {
      return res.status(400).json({ message: 'Search query, genre, or person is required' });
    }

    let response;
    if (genre) {
      // Search by genre
      response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genre,
          page,
          language: 'en-US',
          sort_by: 'popularity.desc'
        }
      });
    } else if (person) {
      // Search by person (actor/director)
      response = await axios.get(`${TMDB_API_URL}/person/${person}/movie_credits`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US'
        }
      });
      // Format the response to match the standard format
      response.data = {
        results: [...response.data.cast, ...response.data.crew],
        total_results: response.data.cast.length + response.data.crew.length,
        total_pages: 1
      };
    } else {
      // Regular search
      response = await axios.get(`${TMDB_API_URL}/search/${type}`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
          language: 'en-US',
          include_adult: false
        }
      });
    }

    // Filter out results without posters and people
    const filteredResults = response.data.results.filter(item => 
      item.media_type !== 'person' && item.poster_path
    );

    // Sort results by relevance (vote_average and popularity)
    const sortedResults = filteredResults.sort((a, b) => {
      const scoreA = (a.vote_average * 0.7) + (a.popularity * 0.3);
      const scoreB = (b.vote_average * 0.7) + (b.popularity * 0.3);
      return scoreB - scoreA;
    });

    res.json({
      ...response.data,
      results: sortedResults
    });
  } catch (err) {
    console.error('Error searching content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get autocomplete suggestions
router.get('/search/suggestions', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get(`${TMDB_API_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'en-US',
        include_adult: false
      }
    });

    // Filter and format suggestions
    const suggestions = response.data.results
      .filter(item => item.media_type !== 'person' && item.poster_path)
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type,
        poster: item.poster_path
      }));

    res.json(suggestions);
  } catch (err) {
    console.error('Error getting suggestions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations based on content
router.get('/search/recommendations/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const response = await axios.get(`${TMDB_API_URL}/${type}/${id}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });

    // Filter and sort recommendations
    const recommendations = response.data.results
      .filter(item => item.poster_path)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);

    res.json(recommendations);
  } catch (err) {
    console.error('Error getting recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const response = await axios.get(`${TMDB_API_URL}/${type}/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        append_to_response: 'videos,credits,similar,recommendations'
      }
    });

    const content = response.data;
    
    // Format the response
    const formattedContent = {
      id: content.id,
      title: content.title || content.name,
      overview: content.overview,
      poster_path: content.poster_path,
      backdrop_path: content.backdrop_path,
      release_date: content.release_date || content.first_air_date,
      vote_average: content.vote_average,
      vote_count: content.vote_count,
      genres: content.genres,
      runtime: content.runtime || content.episode_run_time?.[0],
      status: content.status,
      type: type,
      videos: content.videos?.results || [],
      credits: {
        cast: content.credits?.cast || [],
        crew: content.credits?.crew || []
      },
      similar: content.similar?.results || [],
      recommendations: content.recommendations?.results || []
    };

    res.json(formattedContent);
  } catch (error) {
    console.error('Error fetching content details:', error);
    res.status(500).json({ message: 'Error fetching content details' });
  }
});

// Get content recommendations
router.get('/:id/recommendations', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'movie', page = 1 } = req.query;

    const response = await axios.get(`${TMDB_API_URL}/${type}/${id}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page
      }
    });

    const recommendations = response.data.results.filter(item => item.poster_path);
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// Get content credits
router.get('/:id/credits', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const response = await axios.get(`${TMDB_API_URL}/${type}/${id}/credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ message: 'Error fetching credits' });
  }
});

module.exports = router; 