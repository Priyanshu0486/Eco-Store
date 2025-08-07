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
import { calculateEcoCoins, fetchDashboardStats, fetchRecentOrders, fetchEcoCoinBalance } from '../utils/api';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function Dashboard({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard statistics from backend
  const [dashboardStats, setDashboardStats] = useState({
    totalSpent: 0,
    totalSaved: 0,
    ecoCoinsEarned: 0,
    carbonSaved: 0,
    totalOrders: 0
  });
  
  // Order history from backend
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Current EcoCoin balance
  const [currentEcoCoinBalance, setCurrentEcoCoinBalance] = useState(0);
  
  // Legacy state for fallback (if no backend data)
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalEcoCoins, setTotalEcoCoins] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(30); // Default to 30 days
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Last month');

  useEffect(() => {
    const loadDashboardData = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Please log in to view your dashboard.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard statistics, recent orders, and EcoCoin balance in parallel
        const [statsData, ordersData, ecoCoinBalance] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentOrders(),
          fetchEcoCoinBalance()
        ]);

        // Update dashboard statistics
        setDashboardStats(statsData);
        setRecentOrders(ordersData);
        setCurrentEcoCoinBalance(ecoCoinBalance);

        // Update legacy state for backward compatibility
        setTotalSpent(statsData.totalSpent || 0);
        setTotalSaved(statsData.totalSaved || 0);
        setTotalEcoCoins(statsData.ecoCoinsEarned || 0);

        // Prepare chart data from recent orders
        const chartDataFromOrders = ordersData
          .slice(-7) // Last 7 orders for chart
          .map(order => ({
            date: new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            carbonSaved: order.orderItems?.reduce((sum, item) => 
              sum + (item.product?.carbonSaved || 0) * item.quantity, 0) || 0,
            waterReduced: 0, // You can add this field to your backend if needed
          }));

        setChartData(chartDataFromOrders);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Set default values if backend fails
        setDashboardStats({
          totalSpent: 0,
          totalSaved: 0,
          ecoCoinsEarned: 0,
          carbonSaved: 0,
          totalOrders: 0
        });
        setCurrentEcoCoinBalance(0);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    // Load data from backend
    loadDashboardData();
  }, [timeRange]); 

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
            label={`Total Spent: ₹${(dashboardStats.totalSpent || 0).toFixed(2)}`} 
            color="primary" 
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
          <Chip 
            icon={<SavingsIcon />} 
            label={`Total Saved: ₹${(dashboardStats.totalSaved || 0).toFixed(2)}`} 
            color="secondary"
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
          <Chip 
            icon={<SavingsIcon />} 
            label={`Earned: ${dashboardStats.ecoCoinsEarned || 0} EcoCoins`} 
            color="success" 
            variant="outlined"
            sx={{ px: 1, fontWeight: 500 }}
          />
          <Chip 
            icon={<LocalAtmIcon />} 
            label={`Balance: ${currentEcoCoinBalance} EcoCoins`} 
            color="info" 
            variant="filled"
            sx={{ px: 1, fontWeight: 500, backgroundColor: '#4caf50', color: 'white' }}
          />
          <Chip 
            icon={<Co2Icon />} 
            label={`Carbon Saved: ${(dashboardStats.carbonSaved || 0).toFixed(1)} kg`} 
            color="warning" 
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
                {(dashboardStats.carbonSaved || 0).toFixed(1)} kg
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ≈ {Math.round((dashboardStats.carbonSaved || 0) * 2.2)} lbs of CO₂
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
          
          {error && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 2,
              backgroundColor: '#ffebee',
              borderRadius: 2,
              mb: 2
            }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}
          
          {recentOrders.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              backgroundColor: '#fafafa',
              borderRadius: 2
            }}>
              <ShoppingBagIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your recent orders will appear here
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {recentOrders.map((order, orderIndex) => (
                <React.Fragment key={order.id}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: orderIndex > 0 ? 3 : 0, 
                      mb: 1,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.75rem'
                    }}
                  >
                    Order #{order.id} - {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  
                  
                  {/* Order Summary */}
                  <ListItem 
                    disablePadding 
                    sx={{ 
                      py: 2,
                      px: 0,
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Box sx={{ flex: 1, px: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Order Status: 
                        </Typography>
                        <Chip 
                          label={order.orderStatus || 'PLACED'} 
                          size="small"
                          color={order.orderStatus === 'DELIVERED' ? 'success' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {order.orderItems?.length || 0} items • Total: 
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                          ₹{(order.finalPrice || 0).toFixed(2)}
                        </Typography>
                      </Box>
                      
                      {order.discount && order.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Discount: 
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            -₹{order.discount.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                  
                  {/* Order Items */}
                  {order.orderItems && order.orderItems.map((orderItem, itemIndex) => (
                    <React.Fragment key={`${order.id}-${orderItem.id || itemIndex}`}>
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
                          src={orderItem.product?.imageUrl}
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
                                {orderItem.product?.name || 'Product'}
                              </Typography>
                              {orderItem.quantity > 1 && (
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {orderItem.quantity}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              ₹{(orderItem.price || 0).toFixed(2)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            <Chip 
                              size="small"
                              icon={<Co2Icon sx={{ fontSize: '14px !important' }} />} 
                              label={`${((orderItem.product?.carbonSaved || 0) * orderItem.quantity).toFixed(1)}kg CO₂`} 
                              sx={{ 
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                color: 'success.dark',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: 'success.dark' }
                              }}
                            />
                            
                            {orderItem.product?.waterReduced && (
                              <Chip 
                                size="small"
                                icon={<WaterDropIcon sx={{ fontSize: '14px !important' }} />} 
                                label={`${(orderItem.product.waterReduced * orderItem.quantity).toFixed(1)}L water`} 
                                sx={{ 
                                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                  color: 'primary.dark',
                                  fontWeight: 500,
                                  '& .MuiChip-icon': { color: 'primary.dark' }
                                }}
                              />
                            )}
                            
                            {orderItem.product?.plasticAvoided && (
                              <Chip 
                                size="small"
                                icon={<DoNotTouchIcon sx={{ fontSize: '14px !important' }} />} 
                                label={`${(orderItem.product.plasticAvoided * orderItem.quantity).toFixed(1)} less plastic`} 
                                sx={{ 
                                  backgroundColor: 'rgba(233, 30, 99, 0.1)',
                                  color: 'secondary.dark',
                                  fontWeight: 500,
                                  '& .MuiChip-icon': { color: 'secondary.dark' }
                                }}
                              />
                            )}
                            
                            <Chip 
                              size="small"
                              icon={<LocalAtmIcon sx={{ fontSize: '14px !important' }} />} 
                              label={`+${Math.floor((orderItem.price || 0) / 10)} EcoCoins`} 
                              sx={{ 
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                color: 'warning.dark',
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: 'warning.dark' }
                              }}
                            />
                          </Box>
                        </Box>
                      </ListItem>
                      
                      {itemIndex < (order.orderItems?.length || 0) - 1 && (
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