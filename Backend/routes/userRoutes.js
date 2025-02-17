const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add debugging log
router.use((req, res, next) => {
    console.log('User Route accessed:', req.method, req.url);
    next();
});

// GET all users
router.get('/', userController.getUsers);

// Check if user exists
router.get('/verify', userController.verifyUser);

// Register new user
router.post('/register', userController.createUser);

// Login user
router.post('/login', userController.loginUser);

// Add these new routes alongside your existing ones
router.get('/check-user/:id', userController.checkUserExists);
router.get('/check-user', userController.checkUserExists);

module.exports = router; 