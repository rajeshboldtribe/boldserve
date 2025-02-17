import axios from 'axios';

// Create base axios instance with common configuration
const api = axios.create({
    baseURL: 'http://localhost:8003/api',  // Add /api prefix
    headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
    }
});

// User related API calls
export const userAPI = {
    getAllUsers: () => api.get('/users'),
    // Add other user-related API calls here
};

// Dashboard stats API call
export const getDashboardStats = async () => {
    try {
        const [usersResponse, ordersResponse] = await Promise.all([
            api.get('/users'),
            api.get('/orders')
        ]);

        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];

        const revenue = orders.reduce((sum, order) => {
            const amount = Number(order.totalAmount) || 0;
            return sum + amount;
        }, 0);

        return {
            totalUsers: users.length,
            totalOrders: orders.length,
            totalRevenue: revenue
        };
    } catch (error) {
        console.error('Dashboard Stats Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        throw error;
    }
};

// Add payment-related API functions
export const paymentAPI = {
    getAllPayments: async () => {
        try {
            const response = await api.get('/orders');
            return response;
        } catch (error) {
            console.error('getAllPayments error:', error);
            throw error;
        }
    },
    getSuccessfulPayments: async () => {
        try {
            const response = await api.get('/orders?status=successful');
            return response;
        } catch (error) {
            console.error('getSuccessfulPayments error:', error);
            throw error;
        }
    },
    getCancelledPayments: async () => {
        try {
            const response = await api.get('/orders?status=cancelled');
            return response;
        } catch (error) {
            console.error('getCancelledPayments error:', error);
            throw error;
        }
    },
    getPaymentsByStatus: (status) => api.get(`/orders?status=${status}`)
};

// Export other APIs if needed
export default api; 