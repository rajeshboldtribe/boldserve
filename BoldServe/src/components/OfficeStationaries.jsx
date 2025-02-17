import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardMedia, CardContent, Button, Rating, Divider, Container } from '@mui/material';
import { serviceApi } from '../utils/axios';
import { useParams } from 'react-router-dom';

const OfficeStationariesProduct = ({ onAddToCart, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subCategory } = useParams();

  const fetchOfficeProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviceApi.officeStationeries.getBySubCategory(subCategory);
      console.log('Office Stationeries Response:', response.data);
      
      if (response.data && response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error('Failed to fetch office stationery products');
      }
    } catch (err) {
      console.error('Error fetching office products:', err);
      setError(`Failed to load ${subCategory} products. ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subCategory) {
      fetchOfficeProducts();
    }
  }, [subCategory]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003'}${imagePath}`;
  };

  if (!subCategory) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', mt: 10 }}>
        <Alert severity="info">
          Please select a subcategory to view products
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #C4C2C2, #5E5D5D)',
      padding: '20px',
      mt: 8 
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          mb: 3
        }}>
          <Typography variant="h4" sx={{ 
            mb: 1, 
            color: 'white',
            fontWeight: 600
          }}>
            {subCategory}
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500
          }}>
            Category: Office Stationeries
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No products found in {subCategory}
          </Alert>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'flex-start',
            p: 2
          }}>
            {products.map((product) => (
              <Card key={product._id} sx={{ 
                width: 280,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                backgroundColor: 'white',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(product.image)}
                  alt={product.productName}
                  sx={{ 
                    objectFit: 'contain',
                    p: 2,
                    backgroundColor: '#f5f5f5'
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1,
                  p: 3
                }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ 
                    fontWeight: 600,
                    color: '#2c3e50'
                  }}>
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#2196F3',
                    fontWeight: 600,
                    mb: 1
                  }}>
                    ₹{product.price}
                  </Typography>
                  {product.offers && (
                    <Typography variant="body2" sx={{ 
                      color: '#4caf50',
                      mb: 1,
                      fontWeight: 500
                    }}>
                      Offer: {product.offers}
                    </Typography>
                  )}
                  {product.rating && (
                    <Box sx={{ mb: 2 }}>
                      <Rating value={product.rating} readOnly size="small" />
                    </Box>
                  )}
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 'auto',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1AC6E9 90%)',
                        transform: 'scale(1.02)'
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                    onClick={() => onAddToCart(product)}
                    disabled={!isLoggedIn}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OfficeStationariesProduct;