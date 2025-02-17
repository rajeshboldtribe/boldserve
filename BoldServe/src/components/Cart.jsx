import React from 'react';
import { Box, Typography, Card, CardContent, Button, Container, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems, isLoggedIn }) => {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mt: 10, 
        p: 3 
      }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Please login to view your cart
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price), 0);
  };

  return (
    <Container sx={{ mt: 10, mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Your Cart</Typography>
      
      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your cart is empty</Typography>
          <Button 
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white'
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item._id} sx={{ mb: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{item.price}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => handleRemoveFromCart(item._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: '100px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Total:</Typography>
                  <Typography variant="h6">₹{calculateTotal()}</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                  }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart; 