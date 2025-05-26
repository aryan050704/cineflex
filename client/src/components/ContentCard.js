import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const ContentCard = ({ content }) => {
  const navigate = useNavigate();
  const isMovie = content.media_type === 'movie' || content.type === 'movie';

  const handleClick = () => {
    navigate(`/movie/${content.id}?type=${isMovie ? 'movie' : 'tv'}`);
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return 'https://via.placeholder.com/500x750';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const getRating = () => {
    const rating = content.vote_average || content.rating;
    return rating ? (rating / 2).toFixed(1) : 0;
  };

  const getReleaseYear = () => {
    const date = content.release_date || content.first_air_date;
    if (!date) return null;
    return format(new Date(date), 'yyyy');
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6
        }
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="400"
        image={getPosterUrl(content.poster_path)}
        alt={content.title || content.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {content.title || content.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={parseFloat(getRating())}
            readOnly
            precision={0.5}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {getRating()}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {content.overview || content.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={isMovie ? 'Movie' : 'TV Show'}
            size="small"
            color="primary"
          />
          {getReleaseYear() && (
            <Chip
              label={getReleaseYear()}
              size="small"
              variant="outlined"
            />
          )}
          {content.genre_ids && content.genre_ids.length > 0 && (
            <Chip
              label={content.genre_ids[0]}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContentCard; 