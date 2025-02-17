import axios from 'axios';

const API_URL = 'http://localhost:8003/api';

const instance = axios.create({
    baseURL: 'http://localhost:8003',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        console.log('Request being sent:', config);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

// API endpoints for categories and subcategories
export const categoryApi = {
    getCategories: () => axios.get(`${API_URL}/categories`),
    getCategorySubcategories: (categoryId) => axios.get(`${API_URL}/categories/${categoryId}/subcategories`),
    getPrintAndDemandsSubCategories: () => axios.get(`${API_URL}/categories/print-and-demands/subcategories`),
    getPrintAndDemands: () => axios.get('/api/categories/print-demands'),
    getITServices: () => axios.get('/api/categories/it-services'),
    getOfficeStationeries: () => axios.get('/api/categories/office-stationeries'),
    getPrintAndDemands: () => axios.get('/api/categories/print-and-demands'),
    getITServices: () => axios.get('/api/categories/it-services')
};

export const userAPI = {
    register: async (userData) => {
        try {
            const response = await instance.post('/api/users/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await instance.post('/api/users/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
};

export const productApi = {
    getAllProducts: () => instance.get('/products'),
    getProductsByCategory: (categoryId) => instance.get(`/products/category/${categoryId}`),
    getProductsBySubCategory: (category, subCategory) => {
        return axios.get(`${API_URL}/api/services/products`, {
            params: {
                category,
                subCategory
            }
        });
    },
    getProductById: (id) => instance.get(`/products/${id}`),
    getAllStationeryProducts: () => instance.get('/products/stationery'),
    getStationeryBySubCategory: (subCategoryId) => 
        instance.get(`/products/stationery/subcategory/${subCategoryId}`)
};

export default instance;