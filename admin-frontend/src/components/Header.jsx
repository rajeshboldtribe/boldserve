import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Box,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const drawerWidth = 240;

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                bgcolor: 'white',
                color: 'text.primary',
                boxShadow: 1
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome, to BoldServe Admin Panel
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    
                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>

                    <IconButton 
                        onClick={handleProfileClick}
                        size="small"
                    >
                        <Avatar 
                            sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: 'primary.main'
                            }}
                        >
                            A
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My Account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;