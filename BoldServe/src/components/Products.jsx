import { Box, Button, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login';

const Products = ({ selectedCategory, selectedSubCategory, onAddToCart, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/services/category';
        
        const response = await axios.get(endpoint, {
          params: {
            category: selectedCategory,
            subCategory: selectedSubCategory
          }
        });

        let filteredProducts = response.data;

        // Filter products based on both category and subcategory
        if (selectedCategory && selectedSubCategory) {
          filteredProducts = response.data.filter(product => 
            product.category === selectedCategory && 
            product.subCategory === selectedSubCategory
          );
        }
        // Filter only by category if no subcategory is selected
        else if (selectedCategory) {
          filteredProducts = response.data.filter(product => 
            product.category === selectedCategory
          );
        }

        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [selectedCategory, selectedSubCategory]);

  const formatOffer = (offer) => {
    const cleanOffer = offer.replace(/[%OFF\s]/g, '');
    return `${cleanOffer}% OFF`;
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      // Store the selected product and open login modal
      setSelectedProduct(product);
      setLoginModalOpen(true);
    } else {
      // Add to cart if logged in
      onAddToCart(product);
    }
  };

  const handleLoginSuccess = (user) => {
    // Close the login modal
    setLoginModalOpen(false);
    
    // If there was a product waiting to be added
    if (selectedProduct) {
      onAddToCart(selectedProduct);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography>
          No products found for {selectedSubCategory || selectedCategory}.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: 2,
        backgroundColor: '#C4C2C2',
        height: '354px',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
        marginTop: '20px'
      }} 
    >
      <Container 
        maxWidth={false}
        sx={{
          height: '100%',
          pl: 3,
          pr: 3,
          maxWidth: '1800px',
          margin: '0 auto'
        }}
      >
        {/* Category Title and Horizontal Line */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'left',
              mb: 1
            }}
          >
            {selectedSubCategory 
              ? `${selectedSubCategory}`
              : selectedCategory 
                ? `${selectedCategory}`
                : 'All Products'}
          </Typography>
          <Box 
            sx={{ 
              width: '100%', 
              height: '2px', 
              backgroundColor: '#333',
              mb: 2
            }} 
          />
        </Box>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} lg={2.4} key={product._id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {product.offers && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 5,
                      left: 5,
                      backgroundColor: '#ff4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      zIndex: 1,
                    }}
                  >
                    {formatOffer(product.offers)}
                  </Box>
                )}

                <Box
                  sx={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <img
                    src={`http://localhost:8003/${product.image}`}
                    alt={product.productName}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      console.error('Image load error:', product.image);
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 0.5,
                    fontWeight: 500,
                    height: '2.4em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.productName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ 
                    mb: 1,
                    height: '2.4em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.description}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#7B68EE',
                    }}
                  >
                    ₹{product.price}
                  </Typography>
                  {product.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', gap: 0.25 }}>
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            style={{
                              color: index < Math.floor(product.rating) ? '#ffc107' : '#e0e0e0',
                              fontSize: '0.75rem',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon sx={{ fontSize: '0.9rem' }} />}
                  onClick={() => handleAddToCart(product)}
                  size="small"
                  sx={{
                    mt: 'auto',
                    backgroundColor: '#7B68EE',
                    '&:hover': {
                      backgroundColor: '#6A5ACD',
                    },
                    textTransform: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    py: 0.5,
                  }}
                >
                  Add to Cart
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Login Modal */}
      <Login
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </Box>
  );
};

export default Products;