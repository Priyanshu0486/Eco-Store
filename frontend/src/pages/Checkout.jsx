import React from 'react';
import { Container, Typography, Paper, Button, Box, List, ListItem, ListItemText, Divider, CircularProgress, TextField, Chip, IconButton } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Add, Remove, Delete } from '@mui/icons-material';
import { calculateEcoCoins } from '../utils/api';

function Checkout() {
  const { cart, checkout, appliedCoupon, applyCoupon, removeCoupon, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');
  const navigate = useNavigate();



  const handlePurchase = () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      checkout();
      setIsProcessing(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    alert(result.message);
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth='md' sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant='contained' 
          color='primary' 
          onClick={() => navigate('/eco-store')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const shippingCost = 49; // Fixed shipping cost
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount
    : 0;

  const total = subtotal - discount + shippingCost;
  const ecoCoins = cart.reduce((total, item) => total + (calculateEcoCoins(item.price) * item.quantity), 0);

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom color='primary'>
        Checkout
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Order Summary
        </Typography>
        
        <List>
          {cart.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ pr: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <ListItemText 
                  primary={item.name} 
                  secondary={`Price: ₹${item.price.toFixed(2)}`}
                  sx={{ flexGrow: 1, minWidth: '150px' }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                  <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => increaseQuantity(item.id)}>
                    <Add />
                  </IconButton>
                </Box>
                <Typography sx={{ width: '100px', textAlign: 'right', mx: 2 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                  <Delete />
                </IconButton>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
          {appliedCoupon && (
            <Typography color="success.main">Discount: -₹{discount.toFixed(2)}</Typography>
          )}
          <Typography>Shipping: ₹{shippingCost.toFixed(2)}</Typography>
          <Typography variant='h6' sx={{ mt: 1 }}>
            Total: ₹{total.toFixed(2)}
          </Typography>
        </Box>
        
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>Apply Coupon</Typography>
          {!appliedCoupon ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Coupon Code"
                variant="outlined"
                size="small"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleApplyCoupon}>Apply</Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip label={`Coupon Applied: ${appliedCoupon.code}`} color="success" />
              <Button variant="outlined" color="error" onClick={removeCoupon}>Remove</Button>
            </Box>
          )}
        </Paper>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
          <Typography>
            You'll earn {ecoCoins} EcoCoins with this purchase!
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            variant='outlined' 
            onClick={() => navigate('/eco-store')}
          >
            Continue Shopping
          </Button>
          <Button 
            variant='contained' 
            color='success' 
            onClick={handlePurchase}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Checkout;
