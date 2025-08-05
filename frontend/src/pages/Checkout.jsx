import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Box, List, ListItem, ListItemText, Divider, CircularProgress, TextField, Chip, IconButton, Grid, Alert, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Add, Remove, Delete } from '@mui/icons-material';
import { calculateEcoCoins, createOrder, createPaymentOrder } from '../utils/api';

function Checkout() {
  const { cart, appliedCoupon, applyCoupon, removeCoupon, removeFromCart, increaseQuantity, decreaseQuantity, checkout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
    if (cart.length === 0) return;

    if (!shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    // Calculate totals
    const shippingCost = 49;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = appliedCoupon
      ? appliedCoupon.type === 'percentage'
          ? subtotal * appliedCoupon.discount
          : appliedCoupon.discount
      : 0;
    const total = subtotal - discount + shippingCost;

    setIsProcessing(true);
    setError(null);

    if (paymentMethod === 'COD') {
      const orderData = {
        shippingAddress: shippingAddress,
        orderItems: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        paymentMethod: 'COD',
        paymentId: null,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };

      try {
        await createOrder(orderData);
        checkout();
        alert('Order placed successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to create order:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsProcessing(false);
      }
    } else if (paymentMethod === 'RAZORPAY') {
      try {
        const paymentOrder = await createPaymentOrder(Math.round(total));
        const { orderId, amount } = paymentOrder;

        const options = {
          key: 'rzp_test_fFrUf9BaSe3JT1', // Replace with your actual Razorpay Key ID
          amount: amount,
          currency: "INR",
          name: "Eco-Store",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            const orderData = {
              shippingAddress,
              orderItems: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
              couponCode: appliedCoupon ? appliedCoupon.code : null,
              paymentMethod: 'RAZORPAY',
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            try {
              await createOrder(orderData);
              checkout();
              alert('Payment successful and order placed!');
              navigate('/dashboard');
            } catch (err) {
              console.error('Failed to create final order:', err);
              setError(err.message || 'Failed to finalize order after payment.');
            }
          },
          prefill: {
            name: "Eco-Store User",
            email: "user@ecostore.com",
            contact: "9999999999"
          },
          theme: {
            color: "#4CAF50"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response) {
          setError(`Payment failed: ${response.error.description}`);
          console.error(response.error);
        });

      } catch (err) {
        console.error('Razorpay error:', err);
        setError(err.message || 'Could not connect to payment gateway.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    alert(result.message);
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth='md' sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom>Your cart is empty</Typography>
        <Button variant='contained' color='primary' onClick={() => navigate('/eco-store')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const shippingCost = 49;
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
        ? subtotal * appliedCoupon.discount
        : appliedCoupon.discount
    : 0;
  const total = subtotal - discount + shippingCost;
  const ecoCoins = cart.reduce((total, item) => total + (calculateEcoCoins(item.price) * item.quantity), 0);

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom color='primary'>Checkout</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth label="Street Address" name="streetAddress" value={shippingAddress.streetAddress} onChange={handleAddressChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="State" name="state" value={shippingAddress.state} onChange={handleAddressChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Zip Code" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: '20px' }}>
            <Typography variant='h6' gutterBottom>Order Summary</Typography>
            <List dense>
              {cart.map((item) => (
                <ListItem key={item.id} disableGutters sx={{ alignItems: 'center' }}>
                  {/* Quantity controls */}
                  <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => increaseQuantity(item.id)}>
                    <Add fontSize="small" />
                  </IconButton>

                  {/* Product name */}
                  <ListItemText primary={item.name} sx={{ ml: 2 }} />

                  {/* Price */}
                  <Typography sx={{ mr: 1 }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>

                  {/* Remove */}
                  <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disableGutters>
                <ListItemText primary="Subtotal" />
                <Typography>₹{subtotal.toFixed(2)}</Typography>
              </ListItem>
              {appliedCoupon && (
                <ListItem disableGutters sx={{ color: 'success.main' }}>
                  <ListItemText primary={`Discount (${appliedCoupon.code})`} />
                  <Typography>-₹{discount.toFixed(2)}</Typography>
                </ListItem>
              )}
              <ListItem disableGutters>
                <ListItemText primary="Shipping" />
                <Typography>₹{shippingCost.toFixed(2)}</Typography>
              </ListItem>
              <ListItem disableGutters sx={{ color: 'primary.main' }}>
                <ListItemText primary="EcoCoins Earned" />
                <Typography>+{ecoCoins}</Typography>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem disableGutters>
                <ListItemText primary={<Typography variant="h6">Total</Typography>} />
                <Typography variant="h6">₹{total.toFixed(2)}</Typography>
              </ListItem>
            </List>

            <Box sx={{ mt: 2 }}>
              {!appliedCoupon ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField label="Coupon Code" variant="outlined" size="small" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} fullWidth />
                  <Button variant="contained" onClick={handleApplyCoupon}>Apply</Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={`Applied: ${appliedCoupon.code}`} color="success" />
                  <Button variant="outlined" size="small" color="error" onClick={removeCoupon}>Remove</Button>
                </Box>
              )}
            </Box>

            <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="RAZORPAY" control={<Radio />} label="Pay with Razorpay" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button fullWidth variant='contained' color='success' size="large" onClick={handlePurchase} disabled={isProcessing} startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}>
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout;
