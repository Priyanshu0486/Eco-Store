import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link as MuiLink,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'Eco Products', url: '/eco-store' },
        { name: 'Sustainability', url: '/sustainability' },
        { name: 'Gift Cards', url: '/gift-cards' },
        { name: 'Promotions', url: '/promotions' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'EcoCoins', url: '/wallet' },
        { name: 'Orders', url: '/orders' },
        { name: 'Profile', url: '/profile' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '/about' },
        { name: 'Careers', url: '/careers' },
        { name: 'Blog', url: '/blog' },
        { name: 'Press', url: '/press' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', url: '/help' },
        { name: 'Contact Us', url: '/contact' },
        { name: 'Shipping', url: '/shipping' },
        { name: 'Returns', url: '/returns' }
      ]
    }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        py: 2, // Reduced vertical padding
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={isSmallScreen ? 4 : 8}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
                display: 'block',
                mb: 2
              }}
            >
              ECO-STORE
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 3, maxWidth: '300px' }}
            >
              Making sustainable shopping accessible and rewarding. Join us in creating a greener future with every purchase.
            </Typography>
            <Box sx={{ mb: 3 }}>
              <IconButton aria-label="Facebook" color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <Grid item xs={6} sm={3} md={2} key={section.title}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
              <nav>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.name}
                    component={Link}
                    to={link.url}
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mb: 1.5,
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </nav>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} EcoStore. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <MuiLink variant="body2" color="text.secondary" component={Link} to="/privacy">
              Privacy Policy
            </MuiLink>
            <MuiLink variant="body2" color="text.secondary" component={Link} to="/terms">
              Terms of Service
            </MuiLink>
            <MuiLink variant="body2" color="text.secondary" component={Link} to="/cookies">
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;