import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { categoriesWithSubs } from '../utils/categories';
import axios from '../utils/axios'; // Make sure you have axios configured

const Services = () => {
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    productName: '',
    price: '',
    description: '',
    offers: '',
    review: '',
    rating: '',
    image: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCategoryChange = (event) => {
    setFormData({ 
      ...formData, 
      category: event.target.value,
      subCategory: '' 
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const serviceData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          serviceData.append('image', formData[key]);
        } else {
          serviceData.append(key, formData[key]);
        }
      });

      // Fixed the URL by removing the duplicate 'api'
      const response = await axios.post('/services', serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Service created:', response.data);

      setSnackbar({
        open: true,
        message: 'Service created successfully!',
        severity: 'success'
      });

      // Clear form
      setFormData({
        category: '',
        subCategory: '',
        productName: '',
        price: '',
        description: '',
        offers: '',
        review: '',
        rating: '',
        image: null,
      });

    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating service. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleImageChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0]
    });
  };

  return (
    <Box
      sx={{
        marginLeft: '240px',
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          mt: 4,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            label="Category"
          >
            {Object.keys(categoriesWithSubs).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Sub Category</InputLabel>
          <Select
            value={formData.subCategory}
            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            label="Sub Category"
            disabled={!formData.category}
          >
            {formData.category && categoriesWithSubs[formData.category].map((subCategory) => (
              <MenuItem key={subCategory} value={subCategory}>
                {subCategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Product Name"
          sx={{ mb: 2 }}
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
        />

        <TextField
          fullWidth
          label="Price (INR)"
          type="number"
          sx={{ mb: 2 }}
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          InputProps={{
            startAdornment: '₹',
          }}
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 2 }}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <TextField
          fullWidth
          label="Offers"
          sx={{ mb: 2 }}
          value={formData.offers}
          onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
        />

        <TextField
          fullWidth
          label="Review"
          sx={{ mb: 2 }}
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
        />

        <TextField
          fullWidth
          label="Rating"
          type="number"
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          sx={{ mb: 2 }}
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />

        <TextField
          fullWidth
          type="file"
          onChange={handleImageChange}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          Post Data
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Services;