import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home,
  Movie,
  LiveTv,
  Search,
  Bookmark,
  History,
  Person,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Movies', icon: <Movie />, path: '/movies' },
    { text: 'TV Shows', icon: <LiveTv />, path: '/tv-shows' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Watchlist', icon: <Bookmark />, path: '/watchlist' },
    { text: 'History', icon: <History />, path: '/history' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/profile'}
            onClick={() => handleNavigation('/profile')}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        {user?.role === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/admin'}
              onClick={() => handleNavigation('/admin')}
            >
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: isMobile ? 0 : '64px',
          height: isMobile ? '100%' : 'calc(100% - 64px)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 