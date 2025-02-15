require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const subcategoriesRoute = require('./routes/subcategoriesRoute');

const app = express();

// Move CORS and body parsing middleware to the top
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Debugging middleware
app.use((req, res, next) => {
    console.log('\n🔍 Incoming Request Details:');
    console.log('📍 URL:', req.originalUrl);
    console.log('📝 Method:', req.method);
    console.log('📦 Body:', req.body);
    console.log('🎯 Path:', req.path);
    next();
});

// Mount routes BEFORE the 404 handler
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subcategories', subcategoriesRoute);

// 404 handler comes after all valid routes
app.use('*', (req, res) => {
    console.log('\n❌ 404 Error Details:');
    console.log('📍 Attempted URL:', req.originalUrl);
    console.log('📝 Method:', req.method);
    
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        details: {
            requestedUrl: req.originalUrl,
            method: req.method,
            availableRoutes: [
                '/api/services',
                '/api/categories',
                '/api/orders',
                '/api/users',
                '/api/payments',
                '/api/products',
                '/api/subcategories'
            ]
        }
    });
});

// Error handling middleware should be last
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Unauthorized Access'
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Add debugging middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Upload directory initialized');
    console.log(`API URL: http://localhost:${PORT}`);
});

module.exports = app; 