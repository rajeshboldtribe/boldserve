const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createService, getServices, getProductsByCategory } = require('../controllers/serviceController');
const Service = require('../models/Service');

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Wrapper for handling multer errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                status: 'error',
                message: 'File upload error',
                error: err.message
            });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Unknown error occurred during file upload',
                error: err.message
            });
        }
        next();
    });
};

// Request logging middleware
router.use((req, res, next) => {
    console.log(`\n📝 Service Route Request:`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Query:`, req.query);
    console.log(`Body:`, req.body);
    next();
});

// Routes
router.post('/', uploadMiddleware, async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : null
        };

        const service = new Service(serviceData);
        await service.save();

        res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            message: 'Error creating service',
            error: error.message
        });
    }
});

// Get products by category and subcategory
router.get('/category', async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (subCategory) {
            query.subCategory = subCategory;
        }

        console.log('Query parameters:', query);

        const products = await Service.find(query);
        
        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found for the specified category/subcategory'
            });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            message: 'Error fetching services',
            error: error.message
        });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Service Route Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Error in service route',
        error: err.message
    });
});

module.exports = router; 