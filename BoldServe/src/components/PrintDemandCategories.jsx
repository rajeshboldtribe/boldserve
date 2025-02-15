import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { categoryApi } from '../utils/axios';

// Import your images
import businessCardsImg from '../assets/Business Cards.jpg';
import bannersImg from '../assets/Banners.jpg';
import marketingImg from '../assets/marker.jpg';
import printingImg from '../assets/Printing and Demands.jpg';

// Default subcategories for Print and Demands
const defaultPrintDemandSubCategories = [
    { _id: '1', name: 'Business Cards', image: businessCardsImg },
    { _id: '2', name: 'Banners & Posters', image: bannersImg },
    { _id: '3', name: 'Marketing Materials', image: marketingImg },
    { _id: '4', name: 'Printing Products', image: printingImg }
];

// Image mapping
const imageMap = {
    'Business Cards': businessCardsImg,
    'Banners & Posters': bannersImg,
    'Marketing Materials': marketingImg,
    'Printing Products': printingImg
};

const PrintandDemandCategories = () => {
    const [subCategories, setSubCategories] = useState(defaultPrintDemandSubCategories);
    const [selectedSubCategory, setSelectedSubCategory] = useState(defaultPrintDemandSubCategories[0]._id);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await categoryApi.getPrintAndDemands();
                console.log('API Response:', response.data);

                if (response.data && response.data.length > 0) {
                    const categoriesWithImages = response.data.map(cat => ({
                        ...cat,
                        image: imageMap[cat.name] || printingImg
                    }));

                    setSubCategories(categoriesWithImages);
                    setSelectedSubCategory(categoriesWithImages[0]._id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Keep using default subcategories on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategory(subCategory._id);
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px' 
            }}>
                <Typography>Loading Print and Demands Categories...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            py: 3, 
            mt: 6, 
            backgroundColor: '#EAEAEA',
            height: '168px',
            width: '100%',
        }}>
            <Container maxWidth="xl" sx={{ maxWidth: '1440px !important' }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: '#333',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    Print and Demands Categories
                </Typography>

                <Box
                    ref={scrollContainerRef}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: { xs: 12, md: 16 },
                        px: { xs: 2, md: 4 },
                        pb: 2,
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                >
                    {subCategories.map((subCategory) => (
                        <Box
                            key={subCategory._id}
                            onClick={() => handleSubCategorySelect(subCategory)}
                            sx={{
                                flex: '0 0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '100px', sm: '110px' },
                                    height: { xs: '100px', sm: '110px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: '#EAEAEA',
                                    border: selectedSubCategory === subCategory._id
                                        ? '3px solid #7B68EE'
                                        : '1px solid #ddd',
                                    transform: selectedSubCategory === subCategory._id ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: selectedSubCategory === subCategory._id 
                                        ? '0 8px 30px rgba(123, 104, 238, 0.4)'
                                        : '0 2px 10px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '80%',
                                        height: '80%',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        backgroundColor: '#EAEAEA',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        src={subCategory.image}
                                        alt={subCategory.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    color: selectedSubCategory === subCategory._id ? '#7B68EE' : '#333',
                                    transition: 'color 0.3s ease',
                                    maxWidth: '90%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mt: 1,
                                    position: 'absolute',
                                    bottom: '-20px',
                                }}
                            >
                                {subCategory.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default PrintandDemandCategories;