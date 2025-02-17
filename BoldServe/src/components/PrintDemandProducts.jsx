import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const products = [
    {
        id: 1,
        name: 'Premium Business Cards',
        price: 499,
        image: '/images/premium-cards.jpg',
        description: '300gsm matt finish cards with spot UV',
        category: 'Business Cards',
        discount: '25% OFF',
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: 'Vinyl Banners',
        price: 1499,
        image: '/images/vinyl-banner.jpg',
        description: 'Heavy-duty outdoor vinyl banners',
        category: 'Banners & Posters',
        rating: 4.8,
        reviews: 95
    },
    {
        id: 3,
        name: 'Tri-fold Brochures',
        price: 2999,
        image: '/images/brochure.jpg',
        description: 'Full-color glossy brochures',
        category: 'Marketing Materials',
        rating: 4.3,
        reviews: 67
    },
    {
        id: 4,
        name: 'Custom Letterheads',
        price: 799,
        image: '/images/letterhead.jpg',
        description: 'Professional letterhead design and printing',
        category: 'Custom Stationery',
        rating: 4.6,
        reviews: 82
    }
];

const PrintDemandProducts = ({ selectedCategory, onAddToCart }) => {
    const filteredProducts = products.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    return (
        <Box sx={{ py: 3, mt: 6 }} style={{ backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        mb: 4,
                        alignItems: 'flex-start',
                        pt: 2,
                        position: 'relative'
                    }}
                >
                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: '#333'
                    }}>
                        OFFICE STATIONARY SUPPLIES
                    </Typography>

                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        color: '#7B68EE', // Purple color for selected category
                        mb: 2,
                        mt: 1 // Add margin top for spacing between titles
                    }}>
                        {selectedCategory.toUpperCase()} PRODUCTS
                    </Typography>

                    {/* Added Curved Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '0',
                            right: '0',
                            height: '2px',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                height: '2px',
                                background: '#000',
                                borderRadius: '100%',
                                transform: 'scaleY(0.5)'
                            }
                        }}
                    />
                </Box>

                <Grid sx={{ py: 6 }} container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    height: '100%',
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
                                {/* Discount tag */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {product.discount}
                                </Box>

                                {/* Product Image */}
                                <Box
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>

                                {/* Product Details */}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        minHeight: '48px',
                                    }}
                                >
                                    {product.name}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 'auto',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {product.price}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    color: index < product.rating ? '#ffc107' : '#e0e0e0',
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#666',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        ({product.reviews})
                                    </Typography>
                                </Box>

                                {/* Animated Add to Cart Button */}
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={onAddToCart}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#7B68EE',
                                        color: 'white',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#6A5ACD',
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
                                        },
                                        '&:active': {
                                            transform: 'scale(0.98)',
                                        },
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PrintDemandProducts;