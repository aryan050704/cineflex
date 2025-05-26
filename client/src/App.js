import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import MovieDetails from './components/MovieDetails';
import Search from './components/Search';
import History from './components/History';
import Favorites from './components/Favorites';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Trending from './components/Trending';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const MainContent = styled(Box)(({ theme, disableHover }) => ({
  marginLeft: 64,
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  transition: 'margin-left 0.3s ease',
  width: 'calc(100% - 64px)',
  ...(disableHover ? {} : {
    '&:hover': {
      marginLeft: 280,
      width: 'calc(100% - 280px)',
    },
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
    '&:hover': {
      marginLeft: 0,
      width: '100%',
    },
  },
}));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <MainContent disableHover={window.location.pathname === '/'}>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/trending" element={<PrivateRoute><Trending /></PrivateRoute>} />
                <Route path="/popular/movies" element={<PrivateRoute><Home type="movie" category="popular" /></PrivateRoute>} />
                <Route path="/popular/tv" element={<PrivateRoute><Home type="tv" category="popular" /></PrivateRoute>} />
                <Route path="/top-rated" element={<PrivateRoute><Home category="top_rated" /></PrivateRoute>} />
                <Route path="/upcoming" element={<PrivateRoute><Home category="upcoming" /></PrivateRoute>} />
                <Route path="/movie/:id" element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
                <Route path="/tv/:id" element={<PrivateRoute><MovieDetails type="tv" /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
              </Routes>
            </MainContent>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 