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
        
        // Debug: Log the exact subcategory name
        console.log('Selected SubCategory (exact):', `"${selectedSubCategory}"`);
        
        const response = await axios.get('/api/services/category', {
          params: {
            category: 'Office Stationeries',
            subCategory: selectedSubCategory
          }
        });

        // Debug: Log the raw response data
        console.log('Raw API Response:', response.data);
        
        // Log each product's subcategory for comparison
        response.data.forEach(product => {
          console.log('Product SubCategory:', `"${product.subCategory}"`, 
            'Matches selected?:', product.subCategory.trim() === selectedSubCategory.trim());
        });

        const filteredProducts = response.data.filter(product => {
          const subCategoryMatch = product.subCategory.trim() === selectedSubCategory.trim();
          
          // Debug: Log matching details
          console.log('Comparing:', {
            productSubCategory: `"${product.subCategory.trim()}"`,
            selectedSubCategory: `"${selectedSubCategory.trim()}"`,
            matches: subCategoryMatch
          });
          
          return subCategoryMatch;
        });

        console.log('Filtered Products:', filteredProducts);
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

    if (selectedSubCategory) {
      fetchProducts();
    }
  }, [selectedSubCategory]);

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''; // Return empty string or a default image path
    // If the path already starts with http/https, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the backend URL
    return `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8003'}${imagePath}`;
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
          No products found in "{selectedSubCategory}".
          <br />
          Category: Office Stationeries
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
                  <Box
                    component="img"
                    src={getImageUrl(product.image)}
                    alt={product.productName}
                    onError={(e) => {
                      e.target.src = '/default-product-image.jpg'; // Add a default image
                    }}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
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