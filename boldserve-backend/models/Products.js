const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    specifications: [{
        key: String,
        value: String
    }],
    brand: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['available', 'out_of_stock', 'discontinued'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add index for better query performance
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to update the updatedAt field
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
    return `₹${this.price.toFixed(2)}`;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
    return this.stock > 0;
};

// Static method to find products by category and subcategory
productSchema.statics.findByCategories = function(categoryId, subCategoryId) {
    return this.find({
        category: categoryId,
        subCategory: subCategoryId
    }).populate('category subCategory');
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 