import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CardActions,
  CircularProgress,
  Snackbar,
  IconButton,
  Chip,
  TextField
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { fetchEcoCoinBalance, redeemEcoCoins } from '../utils/api';
import { redemptionOptions } from '../utils/ecoProducts';

function Wallet() {
  // State management
  const [ecoCoins, setEcoCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [redemptionHistory, setRedemptionHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('redemptionHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Could not load redemption history from localStorage', error);
      return [];
    }
  });

  // Fetch EcoCoin balance on component mount
  useEffect(() => {
    loadEcoCoinBalance();
  }, []);

  // Persist redemption history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('redemptionHistory', JSON.stringify(redemptionHistory));
    } catch (error) {
      console.error('Could not save redemption history to localStorage', error);
    }
  }, [redemptionHistory]);

  const loadEcoCoinBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await fetchEcoCoinBalance();
      setEcoCoins(balance);
    } catch (err) {
      console.error('Error loading EcoCoin balance:', err);
      setError('Failed to load EcoCoin balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle reward redemption
  const handleRedeem = async (option) => {
    if (ecoCoins < option.coins) {
      setError(`Insufficient EcoCoins. You need ${option.coins} but have ${ecoCoins}.`);
      return;
    }

    try {
      setRedeeming(true);
      setError(null);
      
      const result = await redeemEcoCoins(option.coins);
      
      // Update local balance
      setEcoCoins(result.newBalance);
      
      // Add to redemption history
      const newRedemption = {
        id: Date.now(),
        label: option.label,
        coins: option.coins,
        date: new Date().toISOString(),
        discountAmount: result.discountAmount,
        couponCode: result.couponCode
      };
      setRedemptionHistory(prev => [newRedemption, ...prev]);
    
    // Automatically copy coupon code to clipboard
    try {
      await navigator.clipboard.writeText(result.couponCode);
      setSuccessMessage(`Successfully redeemed ${option.coins} EcoCoins! Your coupon code ${result.couponCode} has been copied to clipboard!`);
    } catch (clipboardErr) {
      console.error('Failed to copy coupon code to clipboard:', clipboardErr);
      setSuccessMessage(`Successfully redeemed ${option.coins} EcoCoins! Your coupon code: ${result.couponCode} (Copy failed - please copy manually)`);
    }
      
    } catch (err) {
      console.error('Error redeeming EcoCoins:', err);
      setError(err.message || 'Failed to redeem EcoCoins. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  // Close snackbar messages
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage('');
  };
  
  // Copy coupon code to clipboard
  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setSuccessMessage(`Coupon code ${couponCode} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
      setError('Failed to copy coupon code. Please copy manually.');
    }
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 5,
      background: 'radial-gradient(circle at top left, #e0f7fa 0%, #e8f5e9 40%, #fffde7 100%)',
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          gutterBottom 
          align="center" 
          sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 4 }}
        >
          EcoCoin Wallet
        </Typography>
        
        {/* Coins Display */}
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            mb: 6, 
            borderRadius: '20px',
            background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="div" sx={{ mb: 1 }}>
            Current EcoCoins Balance
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80px' }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : (
            <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
              {ecoCoins} 🌿
            </Typography>
          )}
          {!loading && (
            <Button 
              variant="outlined" 
              onClick={loadEcoCoinBalance}
              sx={{ 
                mt: 2, 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Refresh Balance
            </Button>
          )}
        </Paper>
        
        {/* Redemption Options */}
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center" 
          sx={{ fontWeight: 'bold', color: '#2e7d32', mt: 6, mb: 4 }}
        >
          Redeem Your EcoCoins
        </Typography>
        
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
          mb: 4,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
            maxWidth: { xs: '100%', lg: 'calc(33.333% - 16px)' },
            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: '300px' }
          }
        }}>
          {redemptionOptions.map(option => (
            <Card 
              key={option.id} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                p: 3, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center' 
              }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
                    {option.label}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                    {option.description}
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {option.coins}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      EcoCoins
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#66bb6a',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '10px 30px',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#4caf50',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#e0e0e0',
                      }
                    }}
                    fullWidth
                    disabled={loading || redeeming || ecoCoins < option.coins}
                    onClick={() => handleRedeem(option)}
                    startIcon={redeeming ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                  >
                    {redeeming ? 'Redeeming...' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
          ))}
        </Box>
        
        {/* Transaction History */}
        <Typography 
          variant="h5" 
          sx={{ mt: 6, mb: 2, fontWeight: 'bold', color: 'green', textAlign: 'center' }}
        >
          Transaction History
        </Typography>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          {redemptionHistory && redemptionHistory.length > 0 ? (
            <List>
              {redemptionHistory.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Redeemed: ${item.label}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.date).toLocaleDateString()}
                          </Typography>
                          {item.discountAmount && (
                            <Typography variant="body2" color="success.main">
                              Discount: ₹{item.discountAmount}
                            </Typography>
                          )}
                          {item.couponCode && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip 
                                label={item.couponCode} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => handleCopyCoupon(item.couponCode)}
                                sx={{ p: 0.5 }}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Typography variant="body1" color="error" sx={{ fontWeight: 'bold' }}>
                      -{item.coins} EcoCoins
                    </Typography>
                  </ListItem>
                  {index < redemptionHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}>
              Recent transactions will appear here.
            </Typography>
          )}
        </Paper>
        
        {/* Error and Success Messages */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Wallet;