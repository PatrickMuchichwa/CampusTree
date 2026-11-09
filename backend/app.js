//app.js configures the Express application.

const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');

const errorMiddleware = require('./middleware/error.middleware');
const notFoundMiddleware = require('./middleware/notFound.middleware');

const app = express();

// Global middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

// Test endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Backend API is running'
    });
});

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;