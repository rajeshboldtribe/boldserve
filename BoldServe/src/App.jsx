import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrintDemandCategories from './components/PrintDemandCategories';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Office Stationeries');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Notebooks & Papers');
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      setCartCount(parsedCart.length);
    }

    // Set initial category and subcategory
    handleCategoryChange('Office Stationeries', 1); // Assuming 1 is the ID for Office Stationeries
  }, []);

  const handleCategoryChange = (categoryName, categoryId) => {
    if (categoryName && categoryId !== undefined) {
      setSelectedCategory(categoryName);
      setSelectedCategoryId(categoryId);
      
      // Set default subcategories based on category
      switch (categoryName) {
        case 'Office Stationeries':
          setSelectedSubCategory('Notebooks & Papers');  // Replace with your first subcategory
          break;
        case 'Print and Demands':
          setSelectedSubCategory('Business Cards');
          break;
        case 'IT Services and Repair':
          setSelectedSubCategory('Computer & Laptop Repair');  // Replace with your first subcategory
          break;
        default:
          setSelectedSubCategory('');
      }
    }
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleSubCategorySelect = (subCategoryName) => {
    setSelectedSubCategory(subCategoryName);
  };

  return (
    <Router>
      <div className="App">
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF'
        }}>
          <Navbar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            cartCount={cartCount}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />

          <Routes>
            {/* Home Route */}
            <Route path="/" element={
              <Box sx={{ flex: 1, mb: 20 }}>
                <Banner />
                <Box mt={8}>
                  <Categories
                    selectedCategory={selectedCategory}
                    selectedCategoryId={selectedCategoryId}
                    selectedSubCategory={selectedSubCategory}
                    onCategoryChange={handleCategoryChange}
                    onSubCategorySelect={handleSubCategorySelect}
                  />
                </Box>
                <Box mt={16} mb={8}>
                  <Products
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    onAddToCart={handleAddToCart}
                    isLoggedIn={isLoggedIn}
                  />
                </Box>
              </Box>
            } />

            {/* Other Routes */}
            <Route path="/products" element={
              <Box sx={{ flex: 1, mb: 20 }}>
                <Categories
                  selectedCategory={selectedCategory}
                  selectedCategoryId={selectedCategoryId}
                  selectedSubCategory={selectedSubCategory}
                  onCategoryChange={handleCategoryChange}
                  onSubCategorySelect={handleSubCategorySelect}
                />
                <Box mt={16}>
                  <Products
                    isLoggedIn={isLoggedIn}
                    onAddToCart={handleAddToCart}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                  />
                </Box>
              </Box>
            } />

            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/print-demands"
              element={
                <Box sx={{ flex: 1, mb: 20 }}>
                  <Categories
                    selectedCategory={selectedCategory}
                    selectedCategoryId={selectedCategoryId}
                    selectedSubCategory={selectedSubCategory}
                    onCategoryChange={handleCategoryChange}
                    onSubCategorySelect={handleSubCategorySelect}
                  />
                  <Products
                    selectedCategory="Print and Demands"
                    selectedSubCategory={selectedSubCategory}
                    onAddToCart={handleAddToCart}
                    isLoggedIn={isLoggedIn}
                  />
                </Box>
              }
            />

            <Route
              path="/it-services"
              element={
                <Box sx={{ flex: 1, mb: 20 }}>
                  <Categories
                    selectedCategory={selectedCategory}
                    selectedCategoryId={selectedCategoryId}
                    selectedSubCategory={selectedSubCategory}
                    onCategoryChange={handleCategoryChange}
                    onSubCategorySelect={handleSubCategorySelect}
                  />
                  <Products
                    selectedCategory="IT Services and Repair"
                    selectedSubCategory={selectedSubCategory}
                    onAddToCart={handleAddToCart}
                    isLoggedIn={isLoggedIn}
                  />
                </Box>
              }
            />
          </Routes>

          <Footer />
        </Box>
      </div>
    </Router>
  );
}

export default App;