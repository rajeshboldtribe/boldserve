const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Existing routes...

// New route to get Office Stationeries subcategories
router.get('/office-stationeries', async (req, res) => {
  try {
    // First find the Office Stationeries category
    const category = await Category.findOne({ name: 'Office Stationeries' });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategories = await SubCategory.find({ categoryId: category._id });
    
    if (!subcategories || subcategories.length === 0) {
      // Initialize default data if none exists
      await SubCategory.initializeDefaultData();
      const newSubcategories = await SubCategory.find({ categoryId: category._id });
      return res.json(newSubcategories);
    }

    res.json(subcategories);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await SubCategory.find();
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching all subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

// Get subcategories by category ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ 
      categoryId: req.params.categoryId 
    });
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

// Get IT Services subcategories
router.get('/it-services', async (req, res) => {
    try {
        // First find or create the IT Services category
        const category = await Category.findOneAndUpdate(
            { name: 'IT Services and Repair' },
            { name: 'IT Services and Repair' },
            { upsert: true, new: true }
        );

        // Check for existing subcategories
        let subcategories = await SubCategory.find({ categoryId: category._id });

        // If no subcategories exist, create default ones
        if (!subcategories || subcategories.length === 0) {
            const defaultSubCategories = [
                {
                    name: 'Computer & Laptop Repair',
                    categoryId: category._id,
                },
                {
                    name: 'Software & OS Support',
                    categoryId: category._id,
                },
                {
                    name: 'Server & Networking Solutions',
                    categoryId: category._id,
                },
                {
                    name: 'IT Security & Cybersecurity Solutions',
                    categoryId: category._id,
                },
                {
                    name: 'Upgradation & Hardware Enhancement',
                    categoryId: category._id,
                },
                {
                    name: 'IT Consultation & AMC Services',
                    categoryId: category._id,
                }
            ];

            subcategories = await SubCategory.insertMany(defaultSubCategories);
            console.log('Created default IT Services subcategories:', subcategories);
        }

        console.log('Sending IT Services subcategories:', subcategories);
        res.json(subcategories);
    } catch (error) {
        console.error('Error in IT Services route:', error);
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
});

// Get Print and Demands subcategories
router.get('/print-and-demands', async (req, res) => {
    try {
        // Find or create Print and Demands category
        const category = await Category.findOneAndUpdate(
            { name: 'Print and Demands' },
            { name: 'Print and Demands' },
            { upsert: true, new: true }
        );

        // Check for existing subcategories
        let subcategories = await SubCategory.find({ categoryId: category._id });

        // If no subcategories exist, create default ones
        if (!subcategories || subcategories.length === 0) {
            const defaultSubCategories = [
                {
                    name: 'Business Cards',
                    categoryId: category._id,
                },
                {
                    name: 'Banners & Posters',
                    categoryId: category._id,
                },
                {
                    name: 'Marketing Materials',
                    categoryId: category._id,
                },
                {
                    name: 'Printing Products',
                    categoryId: category._id,
                }
            ];

            subcategories = await SubCategory.insertMany(defaultSubCategories);
            console.log('Created default Print and Demands subcategories:', subcategories);
        }

        console.log('Sending Print and Demands subcategories:', subcategories);
        res.json(subcategories);
    } catch (error) {
        console.error('Error in Print and Demands route:', error);
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
});

// Export the router
module.exports = router; 