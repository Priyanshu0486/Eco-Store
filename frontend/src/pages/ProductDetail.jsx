import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Chip,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { getProductById } from '../utils/api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Co2Icon from '@mui/icons-material/Co2';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="error" sx={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <AlertTitle>Error</AlertTitle>
          {error || 'Product not found!'}
        </Alert>
        <Button component={Link} to="/eco-store" startIcon={<ArrowBackIcon />} sx={{ mt: 3 }}>
          Back to Shop
        </Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handlePurchaseNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Button component={Link} to="/eco-store" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          Back to Eco Store
        </Button>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Chip label={product.category}  sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 600 }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {product.name}
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                ₹{product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600}}>Environmental Impact</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Co2Icon color="success" /></ListItemIcon>
                    <ListItemText primary={`Saves ${product.carbonSaved}kg of CO₂`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WaterDropIcon color="info" /></ListItemIcon>
                    <ListItemText primary={`Reduces ${product.waterReduced}L of water usage`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><RecyclingIcon color="secondary" /></ListItemIcon>
                    <ListItemText primary={`Avoids ${product.plasticItemsAvoided} plastic items`} />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  startIcon={<ShoppingCartIcon />} 
                  onClick={handleAddToCart}
                  sx={{ flex: 1, py: 1.5, fontWeight: 600 }}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  onClick={handlePurchaseNow}
                  sx={{ flex: 1, py: 1.5, fontWeight: 600 }}
                >
                  Purchase Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProductDetail;
