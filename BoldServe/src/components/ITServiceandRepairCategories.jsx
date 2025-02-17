import { Box, Container, Typography, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { categoryApi } from '../utils/axios';

// Import your images
import computerRepairImg from '../assets/notebooks.jpg';  // Using existing images as placeholders
import softwareImg from '../assets/Banners.jpg';
import networkingImg from '../assets/penpencilekit.jpg';
import securityImg from '../assets/Printing Products.jpg';

const ITServiceandRepairCategories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Image mapping
    const imageMap = {
        'Computer & Laptop Repair': computerRepairImg,
        'Software & OS Support': softwareImg,
        'Server & Networking Solutions': networkingImg,
        'IT Security & Cybersecurity Solutions': securityImg,
        'Upgradation & Hardware Enhancement': securityImg,
        'IT Consultation & AMC Services': securityImg,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await categoryApi.getITServicesSubCategories();
                console.log('IT Services API Response:', response.data);

                if (response.data && response.data.length > 0) {
                    const categoriesWithImages = response.data.map(cat => ({
                        ...cat,
                        image: imageMap[cat.name] || computerRepairImg // Default to first image if not found
                    }));

                    setSubCategories(categoriesWithImages);
                    if (!selectedCategory) {
                        setSelectedCategory(categoriesWithImages[0].name);
                    }
                }
            } catch (error) {
                console.error('Error fetching IT Services:', error);
                // Set default categories on error
                const defaultCategories = [
                    { name: 'Computer & Laptop Repair', image: computerRepairImg },
                    { name: 'Software & OS Support', image: softwareImg },
                    { name: 'Server & Networking Solutions', image: networkingImg },
                    { name: 'IT Security & Cybersecurity Solutions', image: securityImg },
                    { name: 'Upgradation & Hardware Enhancement', image: securityImg },
                    { name: 'IT Consultation & AMC Services', image: securityImg }
                ];
                setSubCategories(defaultCategories);
                if (!selectedCategory && defaultCategories.length > 0) {
                    setSelectedCategory(defaultCategories[0].name);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Remove selectedCategory from dependencies

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                backgroundColor: '#C4C2C2'
            }}>
                <Typography>Loading IT Services...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            py: 3,
            mt: 4,
            backgroundColor: '#C4C2C2',
            position: 'relative'
        }}>
            <Container maxWidth="xl">
                <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: '#333' }}>
                    IT Services and Repair
                </Typography>
                
                {showLeftArrow && (
                    <IconButton
                        onClick={() => scroll('left')}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                )}
                
                {showRightArrow && (
                    <IconButton
                        onClick={() => scroll('right')}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                )}
                
                <Box
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        px: 2,
                        scrollBehavior: 'smooth'
                    }}
                >
                    {subCategories.map((subCategory) => (
                        <Box
                            key={subCategory._id || subCategory.name}
                            onClick={() => setSelectedCategory(subCategory.name)}
                            sx={{
                                flex: '0 0 auto',
                                width: { xs: '280px', sm: '300px' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '16px',
                                borderRadius: '12px',
                                backgroundColor: '#C4C2C2',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 4px 15px rgba(123, 104, 238, 0.3)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    border: selectedCategory === subCategory.name
                                        ? '3px solid #7B68EE'
                                        : '2px solid #ff4444',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#C4C2C2'
                                }}
                            >
                                <img
                                    src={subCategory.image}
                                    alt={subCategory.name}
                                    style={{
                                        width: '60%',
                                        height: '60%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 1,
                                    textAlign: 'center',
                                    color: selectedCategory === subCategory.name ? '#7B68EE' : '#555',
                                    fontWeight: selectedCategory === subCategory.name ? '600' : '500'
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

export default ITServiceandRepairCategories;