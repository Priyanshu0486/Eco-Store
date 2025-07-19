import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Paper, Typography, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { 
  adminGetProducts, 
  adminAddProduct, 
  adminUpdateProduct, 
  adminDeleteProduct 
} from '../utils/api';

const categories = [
  'Home',
  'Personal Care',
  'Fashion',
  'Electronics',
  'Kitchen',
  'Office'
];

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    carbonSaved: '',
    waterReduced: '',
    plasticItemsAvoided: '',
    quantity: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await adminGetProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { 
      ...currentProduct, 
      price: parseFloat(currentProduct.price),
      quantity: parseInt(currentProduct.quantity, 10) 
    };

    try {
      if (isEditing) {
        await adminUpdateProduct(currentProduct.id, productData);
      } else {
        await adminAddProduct(productData);
      }
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '', description: '', price: '', category: '', imageUrl: '',
      carbonSaved: '', waterReduced: '', plasticItemsAvoided: '', quantity: ''
    });
  };

  // --- Stat Card Component ---
  const StatCard = ({ title, value, icon }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="h6">{value}</Typography>
        <Typography color="textSecondary">{title}</Typography>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {/* --- Statistics Section --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Sales" value="₹0.00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value="0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Products" value={products.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Orders" value="0" />
        </Grid>
      </Grid>

      {/* --- Product Management Section --- */}
      <Grid container spacing={3}>
        {/* Product Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Product' : 'Add New Product'}</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth label="Name" name="name" value={currentProduct.name} onChange={handleInputChange} />
              <TextField margin="normal" required fullWidth label="Description" name="description" value={currentProduct.description} onChange={handleInputChange} />
              <TextField margin="normal" required fullWidth label="Price" name="price" type="number" value={currentProduct.price} onChange={handleInputChange} />
              <FormControl margin="normal" required fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  name="category"
                  value={currentProduct.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField margin="normal" required fullWidth label="Quantity" name="quantity" type="number" value={currentProduct.quantity} onChange={handleInputChange} />
              <TextField margin="normal" fullWidth label="Image URL" name="imageUrl" value={currentProduct.imageUrl} onChange={handleInputChange} />
              <TextField margin="normal" fullWidth label="Carbon Saved (kg)" name="carbonSaved" type="number" value={currentProduct.carbonSaved} onChange={handleInputChange} />
              <TextField margin="normal" fullWidth label="Water Reduced (L)" name="waterReduced" type="number" value={currentProduct.waterReduced} onChange={handleInputChange} />
              <TextField margin="normal" fullWidth label="Plastic Items Avoided" name="plasticItemsAvoided" type="number" value={currentProduct.plasticItemsAvoided} onChange={handleInputChange} />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{isEditing ? 'Update Product' : 'Add Product'}</Button>
              {isEditing && <Button fullWidth onClick={resetForm}>Cancel Edit</Button>}
            </Box>
          </Paper>
        </Grid>

        {/* Product Table */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
