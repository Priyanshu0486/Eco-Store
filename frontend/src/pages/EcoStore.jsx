import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { fetchProducts, searchProducts } from '../utils/api'; // Use the API functions

// Product categories for filtering
const categories = [
  'All',
  'Home',
  'Beauty',
  'Fashion',
  'Electronics',
  'Kitchen',
  'Office'
];

function EcoStore() {
  const [products, setProducts] = useState([]); // Start with an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSearchMode, setIsSearchMode] = useState(false); // Track if we're in search mode
  
  const { addToCart } = useCart();

  // Fetch products from the backend when the component mounts or category changes
  useEffect(() => {
    // Only load products by category if we're not in search mode
    if (!isSearchMode) {
      const loadProducts = async () => {
        try {
          setLoading(true);
          const data = await fetchProducts(selectedCategory);
          setProducts(data);
          setError(null);
        } catch (err) {
          setError('Failed to load products. Please try again later.');
          console.error('Fetch Products Error:', err);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [selectedCategory, isSearchMode]);

  // Handle category change - exit search mode and clear search term
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsSearchMode(false);
    setSearchTerm('');
    setAnchorEl(null);
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      setSnackbarMessage(`${product.name} added to cart!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbarMessage('Failed to add item to cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search term is empty, go back to category view
      setIsSearchMode(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchProducts(searchTerm.trim());
      setProducts(searchResults);
      setIsSearchMode(true);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Products are now filtered by the backend, so we use them directly
  const displayProducts = products;

  return (
    <Box sx={{background: 'radial-gradient(circle at top left, #e0f7fa 0%, #e8f5e9 40%, #fffde7 100%)', py: 4}}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: 'linear-gradient(45deg,rgb(70, 161, 75) 30%, #4caf50 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Eco-Friendly Products
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              mb: 4 
            }}
          >
            Shop sustainably, earn EcoCoins, and reduce your carbon footprint with our eco-friendly products.
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 4,
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            px: 2
          }}>
            {/* Search bar */}
            <Box sx={{ width: '100%', maxWidth: '500px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search eco-friendly products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton 
                        size="small" 
                        onClick={handleSearch}
                        sx={{ p: 0.5 }}
                      >
                        🔍
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4caf50',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4caf50',
                      borderWidth: '1px',
                    },
                  },
                }}
              />
            </Box>

            {/* Filter Button and Menu */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', md: 'auto' }
            }}>
              <Button
                id="filter-button"
                aria-controls={Boolean(anchorEl) ? 'filter-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                variant="outlined"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                startIcon={<FilterListIcon />}
              >
                {selectedCategory === 'All' ? 'Filters' : selectedCategory}
              </Button>
              <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                  'aria-labelledby': 'filter-button',
                }}
              >
                {categories.map((category) => (
                  <MenuItem 
                    key={category} 
                    selected={category === selectedCategory}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
          
          <Typography variant="subtitle2" color="text.secondary">
            {displayProducts.length} products found {isSearchMode ? `for "${searchTerm}"` : ''}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : displayProducts.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            my: 8,
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {isSearchMode ? 'No products found for your search.' : 'No products found. Try adjusting your filters.'}
            </Typography>
            {isSearchMode && (
              <Typography variant="body1" color="text.secondary">
                No results for "{searchTerm}"
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            width: '100%',
            maxWidth: '1400px',
            mx: 'auto',
            px: 2,
            '& > *': {
              display: 'flex',
              justifyContent: 'center'
            }
          }}>
            {displayProducts.map((product) => (
              <Box key={product.id} sx={{
                width: '100%',
                maxWidth: '280px',
                display: 'flex'
              }}>
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              </Box>
            ))}
          </Box>
        )}
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default EcoStore;