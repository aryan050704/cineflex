import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  Box,
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/history', config);
        setHistory(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch watch history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Watch History
      </Typography>
      <Paper elevation={3}>
        {history.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No movies in your watch history yet.</Typography>
          </Box>
        ) : (
          <List>
            {history.map((item, index) => (
              <React.Fragment key={item.movieId}>
                <ListItem
                  button
                  onClick={() => handleMovieClick(item.movieId)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <MovieIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={new Date(item.watchedAt).toLocaleDateString()}
                  />
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default History; 