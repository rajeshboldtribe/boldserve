import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';  // Add Toolbar import
import Sidebar from './components/Sidebar';
import Header from './components/Header';  // Import Header
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Orders from './components/Orders';
import Users from './components/Users';
import Payments from './components/Payments';

function App() {
    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <Header />  {/* Add Header component */}
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />  {/* Add this to push content below header */}
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/payments" element={<Payments />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;