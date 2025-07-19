import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, Paper, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        Your Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Your cart is empty.</Typography>
          <Button component={Link} to="/eco-store" variant="contained" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <List>
              {cart.map((item) => (
                <Paper key={item.id} elevation={2} sx={{ mb: 2, p: 2 }}>
                  <ListItem
                    secondaryAction=
                      <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                  >
                    <Box sx={{ width: 80, height: 80, mr: 2, borderRadius: 1, overflow: 'hidden' }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <ListItemText
                      primary={item.name}
                      secondary={`₹${item.price.toFixed(2)}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                      <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => increaseQuantity(item.id)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ minWidth: 80, textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal</Typography>
                <Typography variant="h6">₹{subtotal.toFixed(2)}</Typography>
              </Box>
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Cart;
