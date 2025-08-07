import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import Co2Icon from '@mui/icons-material/Co2';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Link as RouterLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCart } from '../contexts/CartContext';
import { calculateEcoCoins } from '../utils/api';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function Dashboard({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { purchasedItems, environmentalImpact } = useCart();
  const [loading, setLoading] = useState(true);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalEcoCoins, setTotalEcoCoins] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(30); // Default to 30 days
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Last month');

  useEffect(() => {
    // Process purchased items for display
    const processPurchases = () => {
      if (!purchasedItems || purchasedItems.length === 0) {
        setLoading(false);
        return;
      }

      // Group purchases by date
      const groupedByDate = purchasedItems.reduce((acc, item) => {
        const date = item.purchaseDate || new Date().toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      // Convert to array and sort by date (newest first)
      const sortedPurchases = Object.entries(groupedByDate)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
        .map(([date, items]) => ({
          date,
          items: items.map(item => ({
            ...item,
            ecoCoins: calculateEcoCoins(item.price || 0) * (item.quantity || 1)
          }))
        }));

      // Calculate totals
      const spent = purchasedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      const saved = purchasedItems.reduce((sum, item) => sum + (item.couponDiscount || 0), 0);
      const ecoCoins = purchasedItems.reduce((sum, item) => {
        const coinsPerItem = calculateEcoCoins(item.price || 0);
        return sum + coinsPerItem * (item.quantity || 1);
      }, 0);

      setPurchaseHistory(sortedPurchases);
      setTotalSpent(spent);
      setTotalSaved(saved);
      setTotalEcoCoins(ecoCoins);

      // Filter data based on time range
      const now = new Date();
      const filteredPurchases = sortedPurchases.filter(group => {
        const purchaseDate = new Date(group.date);
        const diffTime = Math.abs(now - purchaseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= timeRange;
      });

      // Prepare data for the chart
      const dataForChart = filteredPurchases
        .slice()
        .reverse()
        .map(group => ({
          date: new Date(group.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          carbonSaved: group.items.reduce((sum, item) => sum + (item.carbonSaved || 0), 0),
          waterReduced: group.items.reduce((sum, item) => sum + (item.waterReduced || 0), 0),
        }));

      setChartData(dataForChart);
      setLoading(false);
    };

    processPurchases();
  }, [purchasedItems, timeRange]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          Environmental Impact Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Track the positive environmental impact of your eco-friendly purchases
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Chip 
            icon={<LocalAtmIcon />} 
            label={`Total Spent: ₹${totalSpent.toFixed(2)}`} 
            color="primary" 
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
          <Chip 
            icon={<SavingsIcon />} 
            label={`Total Saved: ₹${totalSaved.toFixed(2)}`} 
            color="secondary"
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
          <Chip 
            icon={<SavingsIcon />} 
            label={`Earned: ${Math.round(totalEcoCoins)} EcoCoins`} 
            color="success" 
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
        </Box>
      </Box>
      
      {/* Environmental Impact Summary */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          backgroundColor: '#f5f9f5',
          border: '1px solid #e0e7e0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#2e7d32' }}>
          Your Environmental Impact
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
            maxWidth: { xs: '100%', md: 'calc(33.333% - 16px)' },
            minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: '300px' }
          }
        }}>
          {/* Carbon Saved Card */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            height: '100%'
          }}>
            <Avatar 
              sx={{ 
                bgcolor: 'success.light',
                color: 'success.dark',
                mr: 2,
                width: 60,
                height: 60,
                fontSize: 30,
                flexShrink: 0
              }}
            >
              <Co2Icon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Carbon Saved
              </Typography>
              <Typography variant="h5" fontWeight={700} color="success.dark">
                {environmentalImpact.carbonSaved.toFixed(1)} kg
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ≈ {Math.round(environmentalImpact.carbonSaved * 2.2)} lbs of CO₂
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Environmental Impact Summary */}
      <Card sx={{ 
        borderRadius: 2, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        mb: 4
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              Your Impact Over Time
            </Typography>
            <IconButton 
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ 
                fontSize: '40px',
                '&:hover': {
                  backgroundColor: 'rgba(164, 233, 164, 0.65)'
                }
              }}
            >
              <CalendarMonthIcon sx={{fontSize: '35px'}} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'calendar-button',
              }}
            >
              <MenuItem 
                selected={timeRange === 7}
                onClick={() => {
                  setTimeRange(7);
                  setSelectedPeriod('Last 7 days');
                  setAnchorEl(null);
                }}
                sx={{fontSize: '18px'}}
              >
                Last 7 days
              </MenuItem>
              <MenuItem 
                selected={timeRange === 30}
                onClick={() => {
                  setTimeRange(30);
                  setSelectedPeriod('Last month');
                  setAnchorEl(null);
                }}
                sx={{fontSize: '18px'}}
              >
                Last month
              </MenuItem>
              <MenuItem 
                selected={timeRange === 365}
                onClick={() => {
                  setTimeRange(365);
                  setSelectedPeriod('Last year');
                  setAnchorEl(null);
                }}
                sx={{fontSize: '18px'}}
                >
                Last year
              </MenuItem>
            </Menu>
          </Box>
          
          {chartData.length > 0 ? (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="carbonSaved" fill="#4caf50" name="Carbon Saved (kg)" maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ 
              backgroundColor: '#fafafa', 
              borderRadius: 2, 
              p: 3,
              textAlign: 'center'
            }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Keep shopping to unlock detailed insights into your environmental impact over time.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<ShoppingBagIcon />}
                component={RouterLink}
                to="/eco-store"
              >
                Continue Shopping
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Purchase History */}
      <Card sx={{ 
        borderRadius: 2, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        mb: 4
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'primary.main' }}>
            Your Purchase History
          </Typography>
          
          {purchaseHistory.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              backgroundColor: '#fafafa',
              borderRadius: 2
            }}>
              <ShoppingBagIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                No purchases yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your eco-friendly purchases will appear here
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {purchaseHistory.map((purchaseGroup, groupIndex) => (
                <React.Fragment key={purchaseGroup.date}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: groupIndex > 0 ? 3 : 0, 
                      mb: 1,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {new Date(purchaseGroup.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  
                  {purchaseGroup.items.map((item, itemIndex) => (
                    <React.Fragment key={`${item.id}-${itemIndex}`}>
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          py: 2,
                          px: 0,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            px: 1
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Avatar 
                          src={item.image}
                          variant="rounded"
                          sx={{ 
                            bgcolor: 'grey.100',
                            color: 'text.secondary',
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          <ShoppingBagIcon />
                        </Avatar>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight={500}
                                noWrap
                                sx={{ 
                                  pr: 1,
                                  maxWidth: { xs: '180px', sm: 'none' },
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {item.name}
                              </Typography>
                              {item.quantity > 1 && (
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {item.quantity}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            <Chip 
                              size="small"
                              icon={<Co2Icon sx={{ fontSize: '14px !important' }} />} 
                              label={`${item.carbonSaved || 0}kg CO₂`} 
                              sx={{ 
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                color: 'success.dark',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: 'success.dark' }
                              }}
                            />
                            
                            <Chip 
                              size="small"
                              icon={<WaterDropIcon sx={{ fontSize: '14px !important' }} />} 
                              label={`${item.waterReduced || 0}L water`} 
                              sx={{ 
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                color: 'primary.dark',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: 'primary.dark' }
                              }}
                            />
                            
                            <Chip 
                              size="small"
                              icon={<DoNotTouchIcon sx={{ fontSize: '14px !important' }} />} 
                              label={`${item.plasticAvoided || 0} less plastic`} 
                              sx={{ 
                                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                                color: 'secondary.dark',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: 'secondary.dark' }
                              }}
                            />
                            
                            {item.ecoCoins > 0 && (
                              <Chip 
                                size="small"
                                icon={<LocalAtmIcon sx={{ fontSize: '14px !important' }} />} 
                                label={`+${item.ecoCoins} EcoCoins`} 
                                sx={{ 
                                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                  color: 'warning.dark',
                                  fontWeight: 500,
                                  '& .MuiChip-icon': { color: 'warning.dark' }
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </ListItem>
                      
                      {itemIndex < purchaseGroup.items.length - 1 && (
                        <Divider sx={{ my: 0.5, mx: 2 }} />
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;