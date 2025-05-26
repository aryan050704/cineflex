const watchlistRoutes = require('./routes/watchlist');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/watchlist', watchlistRoutes); 