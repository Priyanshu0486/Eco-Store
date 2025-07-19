import React, { useState } from 'react';
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
  Badge
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../contexts/CartContext';

function Header({ user, onLogout }) {
  const { ecoCoins, cart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Store', path: '/eco-store' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Wallet', path: '/wallet' },
    { text: 'Checkout', path: '/checkout' },
  ];

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Eco-Store
      </Typography>
      <Divider />
      {user?.loggedIn ? (
        <List>
          {menuItems.map((item) => (
            <ListItem button component={Link} to={item.path} key={item.text}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
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
              ECO-STORE
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
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            ECO-STORE
          </Typography>

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
                {user?.loggedIn && menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{ my: 2, color: 'text.primary', display: 'block', mx: 2 }}
                  >
                    {item.text}
                  </Button>
                ))}
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
                    >
                      🌿{ecoCoins} EcoCoins
                    </Button>
                    <Button variant="outlined" color="primary" onClick={onLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button component={Link} to="/login" variant="contained" color="primary">
                    Get Started
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