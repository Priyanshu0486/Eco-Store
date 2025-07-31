import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Snackbar,
  Alert,
  Rating
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Co2Icon from '@mui/icons-material/Co2';
import { calculateEcoCoins } from '../utils/api';
import { useCart } from '../contexts/CartContext';

function ProductCard({ product }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addToCart } = useCart();
  const ecoCoinsToEarn = calculateEcoCoins(product.price);

  // Rating state loaded from localStorage or product props
  const [ratingData, setRatingData] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('productRatings') || '{}');
    return stored[product.id] || { rating: product.rating || 0, numRatings: product.numRatings || 0 };
  });

  // Track the rating given by the current user
  const [userRating, setUserRating] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('userProductRatings') || '{}');
    return stored[product.id] || 0;
  });

  // Persist whenever ratingData changes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('productRatings') || '{}');
    stored[product.id] = ratingData;
    localStorage.setItem('productRatings', JSON.stringify(stored));
  }, [ratingData, product.id]);

  // Persist user rating
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userProductRatings') || '{}');
    stored[product.id] = userRating;
    localStorage.setItem('userProductRatings', JSON.stringify(stored));
  }, [userRating, product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event from bubbling to the card link
    addToCart(product);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Card 
        component={Link}
        to={`/product/${product.id}`}
        target="_blank"
        rel="noopener noreferrer" // Security best practice for target="_blank"
        sx={{ 
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          textDecoration: 'none', // Remove underline from link
          color: 'inherit', // Inherit text color
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.12)'
          },
          '&:hover .product-image': {
            transform: 'scale(1.05)'
          }
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          height: '200px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <CardMedia
            className="product-image"
            component="img"
            image={product.imageUrl || product.image}
            alt={product.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </Box>
        
        {/* Product Info */}
        <CardContent sx={{ 
          p: 2, 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: 600, 
                mb: 1, 
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {product.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 1, 
              my: 1
            }}>
              <Chip 
                icon={<Co2Icon fontSize="small" />} 
                label={`Saves ${product.carbonSaved}kg CO₂`} 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
          <Box>
            {/* Rating and reviews */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <Rating
                value={ratingData.rating}
                precision={0.5}
                size="small"
                onChange={(_, newValue) => {
                  if (!newValue) return;
                  setUserRating(newValue);
                  setRatingData(prev => {
                    const total = prev.rating * prev.numRatings + newValue;
                    const newCount = prev.numRatings + 1;
                    return { rating: +(total / newCount).toFixed(1), numRatings: newCount };
                  });
                }}
              />
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {ratingData.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({ratingData.numRatings.toLocaleString()})
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, my: 1 }}>
              ₹{product.price}
            </Typography>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleAddToCart}
              sx={{ 
                width: '100%',
                mt: 1,
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {product.name} added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductCard;