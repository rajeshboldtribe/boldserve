import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getDashboardStats } from '../utils/axios';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use getDashboardStats instead of direct API calls
        const stats = await getDashboardStats();
        
        setStats({
          totalOrders: stats.totalOrders || 0,
          totalRevenue: stats.totalRevenue || 0,
          totalUsers: stats.totalUsers || 0
        });

      } catch (err) {
        console.error('Dashboard API Error:', err);
        let errorMessage = 'Failed to load dashboard statistics. ';
        
        if (!navigator.onLine) {
          errorMessage += 'No internet connection. ';
        } else if (err.response?.status === 404) {
          errorMessage += 'API endpoint not found. ';
        } else if (err.response?.status === 401) {
          errorMessage += 'Authentication failed. ';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          marginLeft: '240px',
          padding: '24px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading dashboard statistics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          marginLeft: '240px',
          padding: '24px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            width: '80%', 
            maxWidth: '600px'
          }}
        >
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check:
          <ul>
            <li>Backend server is running on port 8003</li>
            <li>API endpoints are correctly configured</li>
            <li>You have proper authentication</li>
          </ul>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginLeft: '240px',
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid 
        container 
        spacing={4} 
        maxWidth="1200px"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              },
              background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
              color: 'white',
              minHeight: '200px',
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <ShoppingCartIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h3">
                {stats.totalOrders.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              minHeight: '200px',
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <TrendingUpIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h3">
                ₹{stats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={3}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              },
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              minHeight: '200px',
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <PeopleIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">
                {stats.totalUsers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;