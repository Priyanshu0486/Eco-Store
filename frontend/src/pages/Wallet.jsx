import React from 'react';
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
  CardActions
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { redemptionOptions } from '../utils/ecoProducts';

function Wallet() {
  const { ecoCoins, redeemEcoCoins, redemptionHistory } = useCart();

  // Handle reward redemption
  const handleRedeem = (option) => {
    const result = redeemEcoCoins(option);
    alert(result.message);
  };
  
  return (
    <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', py: 5 }}>
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
          <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
            {ecoCoins} 🌿
          </Typography>
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
                    disabled={ecoCoins < option.coins}
                    onClick={() => handleRedeem(option)}
                  >
                    Redeem
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
                      secondary={`On ${new Date(item.date).toLocaleDateString()}`}
                    />
                    <Typography variant="body1" color="error">
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
      </Container>
    </Box>
  );
}

export default Wallet;