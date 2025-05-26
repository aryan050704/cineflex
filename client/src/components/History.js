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
  Box,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
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
      } catch (err) {
        setError('Error fetching watch history');
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Watch History
      </Typography>
      {history.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Your watch history is empty. Start watching movies to build your history!
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <List>
            {history.map((item) => (
              <ListItem
                key={item.movieId}
                button
                onClick={() => navigate(`/movie/${item.movieId}`)}
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
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default History; 