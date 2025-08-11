import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import {
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus
} from '../utils/api';

// Status options for dropdowns
const ORDER_STATUS_OPTIONS = ['PENDING', 'PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUS_OPTIONS = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [tempOrderStatus, setTempOrderStatus] = useState('');
  const [tempPaymentStatus, setTempPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load orders from backend
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminGetAllOrders();
      // Transform backend data to match our frontend structure
      const transformedOrders = data.map(order => ({
        id: order.id,
        userId: order.user?.id || 'N/A',
        userName: order.user?.name || order.user?.username || 'Unknown User',
        orderId: `ORD-${order.id}`,
        orderDate: order.orderDate,
        totalAmount: parseFloat(order.finalPrice || order.totalPrice || 0),
        orderStatus: order.orderStatus || 'PENDING',
        paymentId: order.paymentId || 'N/A',
        paymentMethod: order.paymentMethod || 'N/A',
        paymentStatus: order.paymentStatus || 'PENDING',
        itemsCount: order.orderItems?.length || 0
      }));
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setSnackbar({ open: true, message: 'Failed to load orders', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter) {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, paymentStatusFilter, orders]);

  // Handle edit order
  const handleEditOrder = (order) => {
    setEditingOrder(order.id);
    setTempOrderStatus(order.orderStatus);
    setTempPaymentStatus(order.paymentStatus);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingOrder(null);
    setTempOrderStatus('');
    setTempPaymentStatus('');
  };

  // Handle save changes
  const handleSaveChanges = async (orderId) => {
    try {
      setUpdating(true);
      const currentOrder = orders.find(order => order.id === orderId);
      
      // Update order status if changed
      if (tempOrderStatus !== currentOrder.orderStatus) {
        await adminUpdateOrderStatus(orderId, tempOrderStatus);
      }
      
      // Update payment status if changed
      if (tempPaymentStatus !== currentOrder.paymentStatus) {
        await adminUpdatePaymentStatus(orderId, tempPaymentStatus);
      }
      
      // Reload orders to get updated data
      await loadOrders();
      
      setSnackbar({ open: true, message: 'Order updated successfully!', severity: 'success' });
      handleCancelEdit();
    } catch (error) {
      console.error('Failed to update order:', error);
      setSnackbar({ open: true, message: 'Failed to update order', severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // Check if order can be edited (only pending payment status orders)
  const canEditOrder = (order) => {
    return order.paymentStatus === 'PENDING';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Manage Orders
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}sx={{ width: '30%' }}>
            <TextField
              fullWidth
              placeholder="Search by customer name, order ID, or user ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ), 
              }}
            />
          </Grid>
          <Grid item xs={50} md={3} sx={{ width: '10%' }}>
            <FormControl fullWidth>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={statusFilter}
                label="Order Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {ORDER_STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ width: '12%' }}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatusFilter}
                label="Payment Status"
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Payment Status</MenuItem>
                {PAYMENT_STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ width: '12%' }}>
            <Typography variant="body2" color="textSecondary">
              Total Orders: {filteredOrders.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Items Count</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow 
                  key={order.id} 
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {order.userId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {order.userName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                      {order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {editingOrder === order.id ? (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={tempOrderStatus}
                          onChange={(e) => setTempOrderStatus(e.target.value)}
                          displayEmpty
                        >
                          {ORDER_STATUS_OPTIONS.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={order.orderStatus} 
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {order.paymentId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.paymentMethod}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {editingOrder === order.id ? (
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={tempPaymentStatus}
                          onChange={(e) => setTempPaymentStatus(e.target.value)}
                          displayEmpty
                        >
                          {PAYMENT_STATUS_OPTIONS.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={order.paymentStatus} 
                        color={getPaymentStatusColor(order.paymentStatus)}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      {order.itemsCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editingOrder === order.id ? (
                        <>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleSaveChanges(order.id)}
                            disabled={updating}
                            title="Save Changes"
                          >
                            {updating ? <CircularProgress size={16} /> : <SaveIcon />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={handleCancelEdit}
                            disabled={updating}
                            title="Cancel Edit"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton 
                            size="small" 
                            color="primary"
                            title="View Order Details"
                          >
                            <ViewIcon />
                          </IconButton>
                          {canEditOrder(order) && (
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => handleEditOrder(order)}
                              title="Edit Order Status (Pending Payment Only)"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No orders found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default OrderList;
