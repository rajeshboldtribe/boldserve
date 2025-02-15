import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Container, Paper, Avatar, 
    Menu, MenuItem, Modal, TextField, Button 
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));
    
    // States for image menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    
    // States for edit modal
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: userData?.fullName || '',
        email: userData?.email || '',
        mobile: userData?.mobile || '',
        address: userData?.address || '',
        bio: userData?.bio || ''
    });

    // Image menu handlers
    const handleImageClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
        handleMenuClose();
    };

    // Modal handlers
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async () => {
        try {
            // Add your API call here to update profile
            console.log('Updated profile data:', formData);
            setOpenModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!userData) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Please login to view your profile
                </Typography>
            </Container>
        );
    }

    return (
        <>
            {/* Profile Content */}
            <Container maxWidth="md" sx={{ my: 8 }}>
                <Paper elevation={3} sx={{ p: 6, borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h4" gutterBottom sx={{ color: '#7B68EE', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                        My Profile
                    </Typography>

                    {/* Profile Image Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={profileImage}
                                onClick={handleImageClick}
                                sx={{ 
                                    width: 150, 
                                    height: 150,
                                    border: '3px solid #7B68EE',
                                    cursor: 'pointer'
                                }}
                            />
                            <CameraAltIcon 
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    backgroundColor: '#7B68EE',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '5px',
                                    cursor: 'pointer'
                                }}
                                onClick={handleImageClick}
                            />
                        </Box>
                    </Box>

                    {/* Image Upload Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem>
                            <input
                                accept="image/*"
                                type="file"
                                hidden
                                id="image-upload"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload">
                                Upload Image
                            </label>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>Open Camera</MenuItem>
                    </Menu>

                    {/* Profile Details */}
                    <Box sx={{ mt: 6, mb: 4 }}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                Full Name
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                {userData.fullName}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                Email Address
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                {userData.email}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                                Contact Number
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: '500' }}>
                                {userData.mobile || 'Not provided'}
                            </Typography>
                        </Box>

                        {/* Edit Profile Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setOpenModal(true)}
                                sx={{
                                    backgroundColor: '#7B68EE',
                                    '&:hover': { backgroundColor: '#6A5ACD' }
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            {/* Edit Profile Modal */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="edit-profile-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '15px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h5" sx={{ mb: 4, color: '#7B68EE', textAlign: 'center' }}>
                        Edit Profile
                    </Typography>

                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        disabled
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        disabled
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        sx={{ mb: 4 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleUpdateProfile}
                        sx={{
                            backgroundColor: '#7B68EE',
                            '&:hover': { backgroundColor: '#6A5ACD' }
                        }}
                    >
                        Update Profile
                    </Button>
                </Box>
            </Modal>

            {/* Bottom spacing */}
            <Box sx={{ mb: 8 }} />
        </>
    );
};

export default Profile; 