import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Modal, TextField, Typography, Fade, Grow } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { userAPI } from '../utils/axios';

const Login = ({ open, onClose, onLogin, initialMode = 'login' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: ''
    });
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Get the product that was attempted to be added to cart (if any)
    const productToAdd = location.state?.product;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Phone number validation function
    const validatePhoneNumber = (phone, country) => {
        const phoneNumberLengths = {
            'in': 10, // India
            'us': 10, // United States
            'gb': 10, // United Kingdom
            'au': 9,  // Australia
            'ca': 10, // Canada
            // Add more countries as needed
        };

        const requiredLength = phoneNumberLengths[country] || 10;
        const numberOnly = phone.replace(/\D/g, '').slice(country.length);
        return numberOnly.length === requiredLength;
    };

    // Handle phone number change
    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({
            ...prev,
            mobile: value
        }));

        if (!validatePhoneNumber(value, country.countryCode)) {
            setPhoneError(`Please enter a valid ${country.name} phone number`);
        } else {
            setPhoneError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate phone number for registration
        if (!isLogin && !formData.mobile) {
            setPhoneError('Phone number is required');
            return;
        }

        try {
            if (isLogin) {
                // Login Flow
                console.log('Attempting login with:', formData.email);
                const loginResponse = await userAPI.login({
                    email: formData.email,
                    password: formData.password
                });

                // Add error handling for undefined response
                if (!loginResponse || !loginResponse.user) {
                    throw new Error('Invalid response from server');
                }

                console.log('Login response:', loginResponse);
                if (loginResponse.user) {
                    // Store token
                    localStorage.setItem('token', loginResponse.token);
                    
                    // Call onLogin callback
                    onLogin(loginResponse.user);
                    
                    // Close the modal
                    onClose();

                    // If there was a product waiting to be added to cart
                    if (productToAdd) {
                        // Add the product to cart (you'll need to implement this)
                        await handleAddToCart(productToAdd);
                        // Navigate back to products
                        navigate('/products');
                    } else {
                        // Navigate to previous page or home
                        navigate(location.state?.from || '/');
                    }
                }
            } else {
                // Registration Flow
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                if (phoneError) {
                    setError('Please enter a valid phone number');
                    return;
                }

                console.log('Attempting registration with:', formData.email);
                const registerResponse = await userAPI.register({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    mobile: formData.mobile
                });

                console.log('Registration response:', registerResponse);
                if (registerResponse.user) {
                    setIsLogin(true);
                    setFormData({
                        fullName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        mobile: ''
                    });
                    setError('Registration successful! Please login.');
                }
            }
        } catch (err) {
            console.error('Error details:', err);
            // Improved error message handling
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Server error: Route not found. Please check API configuration.';
            setError(errorMessage);
        }
    };

    // Fix the handleAddToCart function - loginResponse was undefined
    const handleAddToCart = async (product) => {
        try {
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = [...existingCart, product];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            
            // Update cart count in UI
            if (typeof onLogin === 'function') {
                // Remove reference to undefined loginResponse
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                onLogin({ ...currentUser, cartCount: updatedCart.length });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Failed to add item to cart');
        }
    };

    // Set the initial mode when the modal opens
    useEffect(() => {
        if (open) {
            setIsLogin(initialMode === 'login');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                mobile: ''
            });
            setError('');
        }
    }, [open, initialMode]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="auth-modal"
            closeAfterTransition
        >
            <Fade in={open} timeout={500}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: '15px',
                        boxShadow: 24,
                        overflow: 'hidden',
                        animation: 'slideIn 0.5s ease-out',
                        '@keyframes slideIn': {
                            from: {
                                opacity: 0,
                                transform: 'translate(-50%, -45%)',
                            },
                            to: {
                                opacity: 1,
                                transform: 'translate(-50%, -50%)',
                            },
                        },
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            p: 4,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#555',
                                },
                            },
                        }}
                    >
                        {/* Modal Title */}
                        <Typography 
                            variant="h4" 
                            component="h2" 
                            align="center" 
                            sx={{ 
                                mb: 4,
                                color: '#7B68EE',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Typography>

                        {error && (
                            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}

                        {isLogin ? (
                            // Login Form
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 4 }}
                                />

                                <Grow in={true} timeout={800}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            mb: 3,
                                            bgcolor: '#7B68EE',
                                            py: 1.5,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                bgcolor: '#6A5ACD',
                                                transform: 'scale(1.02)',
                                                '&::after': {
                                                    left: '120%',
                                                },
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '-50%',
                                                left: '-60%',
                                                width: '20px',
                                                height: '200%',
                                                background: 'rgba(255, 255, 255, 0.3)',
                                                transform: 'rotate(35deg)',
                                                transition: 'all 0.6s ease-in-out',
                                            },
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Grow>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button
                                        onClick={() => setIsLogin(false)}
                                        sx={{
                                            color: '#666',
                                            transition: 'all 0.3s ease',
                                            transform: 'scale(1)',
                                            '&:hover': {
                                                color: '#7B68EE',
                                                background: 'none',
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        Don't have an account? Register
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            // Register Form
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 3 }}
                                />

                                {/* Phone Input */}
                                <Box sx={{ mb: 2 }}>
                                    <PhoneInput
                                        country={'in'}
                                        value={formData.mobile}
                                        onChange={(value, country) => handlePhoneChange(value, country)}
                                        inputStyle={{
                                            width: '100%',
                                            height: '56px',
                                            fontSize: '16px',
                                            borderRadius: '4px'
                                        }}
                                        buttonStyle={{
                                            borderRadius: '4px 0 0 4px'
                                        }}
                                        inputProps={{
                                            required: true,
                                            autoFocus: true
                                        }}
                                    />
                                    {phoneError && (
                                        <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                                            {phoneError}
                                        </Typography>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                    sx={{ mb: 4 }}
                                />

                                <Grow in={true} timeout={800}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 2,
                                            mb: 3,
                                            bgcolor: '#7B68EE',
                                            py: 1.5,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                bgcolor: '#6A5ACD',
                                                transform: 'scale(1.02)',
                                                '&::after': {
                                                    left: '120%',
                                                },
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '-50%',
                                                left: '-60%',
                                                width: '20px',
                                                height: '200%',
                                                background: 'rgba(255, 255, 255, 0.3)',
                                                transform: 'rotate(35deg)',
                                                transition: 'all 0.6s ease-in-out',
                                            },
                                        }}
                                    >
                                        Register
                                    </Button>
                                </Grow>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button
                                        onClick={() => setIsLogin(true)}
                                        sx={{
                                            color: '#666',
                                            transition: 'all 0.3s ease',
                                            transform: 'scale(1)',
                                            '&:hover': {
                                                color: '#7B68EE',
                                                background: 'none',
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        Already have an account? Login
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: '#666',
                            minWidth: 'auto',
                            p: 1,
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            '&:hover': {
                                color: '#333',
                                background: 'none',
                                transform: 'rotate(180deg)',
                            },
                        }}
                    >
                        ✕
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default Login;