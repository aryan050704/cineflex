import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/carousel.css';
import { useNavigate } from 'react-router-dom';

const MovieCarousel = ({ movies }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
    adaptiveHeight: true,
  };

  const getBackdropUrl = (backdropPath) => {
    if (!backdropPath) return 'https://via.placeholder.com/1920x1080';
    return `https://image.tmdb.org/t/p/original${backdropPath}`;
  };

  return (
    <Box sx={{ 
      mb: 6,
      borderRadius: '30px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    }}>
      <Slider {...settings}>
        {movies.map((movie) => (
          <Box
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}?type=${movie.media_type || 'movie'}`)}
            sx={{
              position: 'relative',
              height: '70vh',
              cursor: 'pointer',
              '&:hover': {
                '& .overlay': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box
              component="img"
              src={getBackdropUrl(movie.backdrop_path)}
              alt={movie.title || movie.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                padding: 4,
                opacity: 0.7,
                transform: 'translateY(20px)',
                transition: 'all 0.5s ease',
                borderRadius: '0 0 30px 30px',
              }}
            >
              <Typography 
                variant="h3" 
                color="white" 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {movie.title || movie.name}
              </Typography>
              <Typography 
                variant="body1" 
                color="white" 
                sx={{ 
                  maxWidth: '50%',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {movie.overview}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default MovieCarousel; 