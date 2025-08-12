import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from "../pages/logo.png";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useCart } from '../contexts/CartContext';
import { green } from '@mui/material/colors';
import { fetchEcoCoinBalance, getUserProfile, updateUserProfile, getUserAddress } from '../utils/api';

// AccountMenu Component
function AccountMenu({ onLogout, navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    location: ''
  });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    onLogout();
  };
  
  const handleMyAccountClick = async () => {
    handleClose();
    setProfileModalOpen(true);
    await loadUserProfile();
  };
  
  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
    setEditingField(null);
    setTempValue('');
    setError(null);
  };
  
  // Load user profile data from backend
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile and address in parallel
      const [profileData, addressData] = await Promise.all([
        getUserProfile(),
        getUserAddress()
      ]);
      
      setUserProfile({
        name: profileData.username || '',
        email: profileData.email || '',
        mobile: profileData.phoneNumber || '',
        location: addressData || 'No address found'
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Only send editable fields to backend
      const updateData = {
        username: userProfile.name,
        phoneNumber: userProfile.mobile
      };
      
      await updateUserProfile(updateData);
      setProfileModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };
  
  const handleEditField = (field) => {
    setEditingField(field);
    setTempValue(userProfile[field]);
  };
  
  const handleSaveField = async () => {
    try {
      setSaving(true);
      setError(null);
      
      console.log('🔄 Saving field:', editingField, 'with value:', tempValue);
      
      // Only allow editing of name and mobile
      if (editingField === 'name' || editingField === 'mobile') {
        const updateData = {
          username: editingField === 'name' ? tempValue : userProfile.name,
          phoneNumber: editingField === 'mobile' ? tempValue : userProfile.mobile
        };
        
        console.log('📤 Sending update data:', updateData);
        
        const result = await updateUserProfile(updateData);
        console.log('✅ Update successful:', result);
        
        setUserProfile(prev => ({
          ...prev,
          [editingField]: tempValue
        }));
        
        console.log('🔄 Updated local state');
      }
      
      setEditingField(null);
      setTempValue('');
    } catch (error) {
      console.error('❌ Error saving field:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };
  
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 40, height: 40, backgroundColor: green[500] }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        
        <MenuItem onClick={handleMyAccountClick}>
          <Avatar /> My account
        </MenuItem>
        
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Profile Modal */}
      <Dialog
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '450px',
            margin: 'auto'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Close Button */}
          <IconButton 
            onClick={handleProfileModalClose}
            sx={{ 
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'rgba(0,0,0,0.1)',
              color: 'rgba(0,0,0,0.6)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)'
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Profile Header */}
          {!loading && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 4,
            position: 'relative'
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: 'primary.main',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}
              >
                M
              </Avatar>
              {/* Edit Icon on Avatar */}
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '2px solid #f0f0f0',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <EditIcon sx={{ fontSize: 14, color: '#666' }} />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: '#333',
                mb: 0.5
              }}>
                {userProfile.name}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontSize: '16px'
              }}>
                {userProfile.email}
              </Typography>
            </Box>
          </Box>
          )}
          
          {/* Profile Fields */}
          {!loading && (
          <Box sx={{ mb: 4 }}>
            {/* Name Field */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontSize: '16px'
              }}>
                Name
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {editingField === 'name' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '16px',
                          height: '32px'
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={handleSaveField}
                      sx={{ color: 'primary.main' }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleCancelEdit}
                      sx={{ color: '#666' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      color: '#666',
                      fontSize: '16px'
                    }}>
                      {userProfile.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditField('name')}
                      sx={{ 
                        color: '#999',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
            
            {/* Email Field */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontSize: '16px'
              }}>
                Email account
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                color: '#666',
                fontSize: '16px'
              }}>
                {userProfile.email}
              </Typography>
            </Box>
            
            {/* Mobile Field */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontSize: '16px'
              }}>
                Mobile number
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {editingField === 'mobile' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Enter mobile number"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '16px',
                          height: '32px'
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={handleSaveField}
                      sx={{ color: 'primary.main' }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleCancelEdit}
                      sx={{ color: '#666' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 500,
                      color: userProfile.mobile ? '#666' : '#999',
                      fontSize: '16px'
                    }}>
                      {userProfile.mobile || 'Add number'}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditField('mobile')}
                      sx={{ 
                        color: '#999',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
            
            {/* Location Field */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2
            }}>
              <Typography variant="body1" sx={{ 
                color: '#666',
                fontSize: '16px'
              }}>
                Address
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                color: '#666',
                fontSize: '16px'
              }}>
                {userProfile.location}
              </Typography>
            </Box>
          </Box>
          )}
          
          {/* Save Button */}
          {!loading && (
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={saving || loading}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              py: 1.5,
              px: 4,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgb(5, 88, 5)',
                boxShadow: 'none'
              },
              '&:disabled': {
                backgroundColor: '#ccc'
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          )}
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoCoins, setEcoCoins] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch EcoCoin balance when user is logged in
  useEffect(() => {
    const loadEcoCoinBalance = async () => {
      if (user?.loggedIn && localStorage.getItem('jwt')) {
        try {
          setLoadingBalance(true);
          const balance = await fetchEcoCoinBalance();
          setEcoCoins(balance);
        } catch (error) {
          console.error('Failed to fetch EcoCoin balance:', error);
          setEcoCoins(0);
        } finally {
          setLoadingBalance(false);
        }
      } else {
        setEcoCoins(0);
      }
    };

    loadEcoCoinBalance();
  }, [user?.loggedIn]);

  const menuItems = [
    { text: 'EcoStore', path: '/eco-store' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Wallet', path: '/wallet' },
    { text: 'Checkout', path: '/checkout' },
    { text: 'About Us', path: '/about-us' },
  ];

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ECOSTORE
      </Typography>
      <Divider />
      {user?.loggedIn ? (
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem 
                button 
                component={Link} 
                to={item.path} 
                key={item.text}
                sx={{
                  backgroundColor: isActive ? 'rgba(0, 100, 0, 0.1)' : 'transparent',
                  borderLeft: isActive ? `4px solid ${green[500]}` : 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 100, 0, 0.05)',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? green[600] : 'inherit',
                  }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
          <ListItem button onClick={onLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Get Started" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  // Render a simplified header for admin users
  if (user?.role === 'ROLE_ADMIN') {
    return (
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={Link}
              to="/admin"
              sx={{
                mr: 2,
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
                flexGrow: 1
              }}
            >
              EcoStore
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  // Render the full header for regular users and guests
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexGrow: { xs: 1, md: 0 } }}>
            <img 
              src= {logo}
              alt="EcoStore Logo" 
              style={{
                height: '70px',
                marginRight: '5px',
                objectFit: 'contain'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
                display: { xs: 'none', sm: 'block' } // Hide text on extra small screens
              }}
            >
              ECOSTORE
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                {user?.loggedIn && menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      sx={{
                        my: 2,
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: isActive ? 'bold' : 'normal',
                        display: 'block',
                        mx: 5,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '4px',
                          backgroundColor: 'primary.main',
                          transformOrigin: 'left center',
                          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                          transition: 'transform 0.3s ease-in-out',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                {user?.loggedIn ? (
                  <>
                    <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 2 }}>
                      <Badge badgeContent={cart.length} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                    <Button
                      variant="contained"
                      color="success"
                      component={Link}
                      to="/wallet"
                      sx={{ mr: 2, borderRadius: '12px', color: 'white' }}
                      disabled={loadingBalance}
                    >
                      🌿{loadingBalance ? '...' : ecoCoins} EcoCoins
                    </Button>
                    <AccountMenu onLogout={onLogout} navigate={navigate} />
                  </>
                ) : (
                  <Button component={Link} to="/login" variant="contained" color="primary">
                    Explore more!!
                  </Button>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Header; 