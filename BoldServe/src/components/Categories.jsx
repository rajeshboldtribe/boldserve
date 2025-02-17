import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import React from 'react';
import { Box } from '@mui/material';

// Import all images first
import notebooksImage from '../assets/notebook.jpg';
import adhesiveImage from '../assets/Adhesive & Glue.jpg';
import penPencilImage from '../assets/penpencilekit.jpg';
import whitenerImage from '../assets/whitenerandmarker.jpg';
import staplerImage from '../assets/staplerandSissor.jpg';
import calculatorImage from '../assets/Calculators.jpg';
import businessCardsImage from '../assets/Business Cards.jpg';
import bannersImage from '../assets/Banners.jpg';
import marketingImage from '../assets/marker.jpg';
import printingImage from '../assets/Printing and Demands.jpg';
import computerRepairImage from '../assets/computer Reapir.jpg';
import softwareSupportImage from '../assets/Software Supports.jpg';
import networkingImage from '../assets/networking.jpg';
import securityImage from '../assets/securityImage.jpg';
import hardwareImage from '../assets/Hardware.jpg';
import consultationImage from '../assets/consultationImage.jpg';

// Define subcategories mapping outside the component
const subcategoriesMap = {
  'Office Stationeries': {
    'Notebooks & Papers': notebooksImage,
    'Adhesive & Glue': adhesiveImage,
    'Pen & Pencil Kits': penPencilImage,
    'Whitener & Markers': whitenerImage,
    'Stapler & Scissors': staplerImage,
    'Calculator': calculatorImage,
  },
  'Print and Demands': {
    'Business Cards': businessCardsImage,
    'Banners & Posters': bannersImage,
    'Marketing Materials': marketingImage,
    'Printing Products': printingImage,
  },
  'IT Services and Repair': {
    'Computer & Laptop Repair': computerRepairImage,
    'Software & OS Support': softwareSupportImage,
    'Server & Networking Solutions': networkingImage,
    'IT Security & Cybersecurity Solutions': securityImage,
    'Upgradation & Hardware Enhancement': hardwareImage,
    'IT Consultation & AMC Services': consultationImage,
  }
};

const Categories = ({ selectedCategory, onSubCategorySelect, onCategoryChange, selectedSubCategory }) => {
  const [currentSubcategories, setCurrentSubcategories] = useState({});

  useEffect(() => {
    if (selectedCategory && subcategoriesMap[selectedCategory]) {
      setCurrentSubcategories(subcategoriesMap[selectedCategory]);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (categoryName, categoryId) => {
    onCategoryChange(categoryName, categoryId);
  };

  return (
    <div style={{ 
      backgroundColor: '#EAEAEA', 
      height: '168px', 
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      marginTop: '20px'
    }}>
      <div style={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        padding: '20px 0',
        width: '100%'
      }}>
        <Grid container sx={{ 
          display: 'inline-flex', 
          flexWrap: 'nowrap',
          px: 3,
          justifyContent: 'center',
          gap: 4
        }}>
          {Object.entries(currentSubcategories).map(([name, image]) => (
            <Grid item key={name}>
              <Box
                sx={{
                  padding: '12px 24px',
                  cursor: 'pointer',
                  borderRadius: '25px',  // Makes it circular/pill-shaped
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedSubCategory === name 
                    ? 'rgba(0, 0, 0, 0.05)' 
                    : 'transparent',
                  boxShadow: selectedSubCategory === name 
                    ? '0 4px 15px rgba(0, 0, 0, 0.15)' 
                    : 'none',
                  filter: selectedSubCategory === name 
                    ? 'blur(0)' 
                    : 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                  }
                }}
                onClick={() => onSubCategorySelect(name)}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  border: selectedSubCategory === name ? '2px solid #1976d2' : 'none',
                  boxShadow: selectedSubCategory === name 
                    ? '0px 4px 8px rgba(0, 0, 0, 0.1)' 
                    : 'none'
                }}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={name}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <CardContent sx={{ 
                  padding: '10px 0',
                  '&:last-child': { pb: 0 }
                }}>
                  <Typography 
                    variant="body2" 
                    align="center"
                    sx={{ 
                      fontSize: '1rem',
                      fontWeight: selectedSubCategory === name ? 600 : 500,
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      color: selectedSubCategory === name ? '#1976d2' : 'inherit'
                    }}
                  >
                    {name}
                  </Typography>
                </CardContent>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Categories;