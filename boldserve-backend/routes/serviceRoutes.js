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
        fileSize: 10 * 1024 * 1024 // Increased to 10MB limit
    }
}).single('image');

// Wrapper for handling multer errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: 'error',
                    message: 'File is too large. Maximum size is 10MB',
                    error: err.message
                });
            }
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

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
router.post('/', uploadMiddleware, async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            category: req.body.category.trim(),
            subCategory: req.body.subCategory.trim(),
            productName: req.body.productName.trim(),
            price: Number(req.body.price),
            description: req.body.description.trim(),
            offers: req.body.offers ? req.body.offers.trim() : '',
            review: req.body.review ? req.body.review.trim() : '',
            rating: req.body.rating ? Number(req.body.rating) : 0,
            image: req.file ? `/api/services/uploads/${req.file.filename}` : null
        };

        console.log('Creating service with data:', serviceData);

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

        if (category && subCategory) {
            query = {
                category: new RegExp('^' + category.trim() + '$', 'i'),
                subCategory: new RegExp('^' + subCategory.trim() + '$', 'i')
            };
        } else if (category) {
            query = {
                category: new RegExp('^' + category.trim() + '$', 'i')
            };
        }

        console.log('Query parameters:', query);

        const products = await Service.find(query);
        console.log('Found products:', products);
        
        if (products.length === 0) {
            console.log('No products found for:', { category, subCategory });
            return res.status(200).json([]); // Return empty array instead of 404
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

// Get all services with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        let query = {};

        if (category && subCategory) {
            query = {
                category: new RegExp('^' + category.trim() + '$', 'i'),
                subCategory: new RegExp('^' + subCategory.trim() + '$', 'i')
            };
        } else if (category) {
            query = {
                category: new RegExp('^' + category.trim() + '$', 'i')
            };
        }

        console.log('Query for all services:', query);
        const services = await Service.find(query);
        console.log(`Found ${services.length} services`);
        
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