import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Grid,
  Skeleton,
  Alert,
  Chip
} from '@mui/material';
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  ShoppingCart,
  Recommend 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProductRecommendations } from '../utils/api';

const ProductRecommendations = ({ productId }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Number of products to show at once
  const itemsPerPage = 5;

  useEffect(() => {
    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProductRecommendations(productId);
      
      if (response.success && response.recommendations) {
        // Sort recommendations by carbonSaved in descending order (highest first)
        const sortedRecommendations = [...response.recommendations].sort((a, b) => {
          // Handle both string and number values, and null/undefined
          const aCarbonSaved = a.carbonSaved ? parseFloat(a.carbonSaved) : 0;
          const bCarbonSaved = b.carbonSaved ? parseFloat(b.carbonSaved) : 0;
          
          // Sort in descending order (highest carbon saved first)
          return bCarbonSaved - aCarbonSaved;
        });
        
        console.log('Sorted recommendations by carbon saved:', sortedRecommendations.map(p => ({ name: p.name, carbonSaved: p.carbonSaved })));
        setRecommendations(sortedRecommendations);
      } else {
        setError('No recommendations found');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < recommendations.length && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(currentIndex + itemsPerPage);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(Math.max(0, currentIndex - itemsPerPage));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Recommended Products
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, overflow: 'hidden', mb: 3 }}>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ flex: '0 0 calc(20% - 12px)', minWidth: 0 }}>
              <Card>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '8px 8px 0 0' }} />
                <CardContent sx={{ textAlign: 'center', p: 1 }}>
                  <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" height={16} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" height={18} width="50%" sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (error || !recommendations.length) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Recommended Products
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          {error || 'No recommendations available at the moment.'}
        </Alert>
      </Box>
    );
  }

  const canGoNext = currentIndex + itemsPerPage < recommendations.length;
  const canGoPrev = currentIndex > 0;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <Recommend sx={{ mr: 1, color: 'green' }} />
          Recommended for You
        </Typography>
      </Box>

      {/* Carousel Container with Side Arrows */}
      <Box sx={{ position: 'relative', px: 4, py: 2 }}>
        {/* Left Arrow */}
        {canGoPrev && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              color: 'rgba(0, 0, 0, 0.8)',
              width: 40,
              height: 40,
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'primary.main',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBackIos sx={{ fontSize: 16 }} />
          </IconButton>
        )}

        {/* Right Arrow */}
        {canGoNext && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              color: 'rgba(0, 0, 0, 0.8)',
              width: 40,
              height: 40,
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'primary.main',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIos sx={{ fontSize: 16 }} />
          </IconButton>
        )}

        {/* Products Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'nowrap', 
          gap: 2, 
          overflow: 'hidden',
          mb: 3,
          transition: 'opacity 0.3s ease-in-out'
        }}>
          {recommendations.slice(currentIndex, currentIndex + itemsPerPage).map((product, index) => (
            <Box 
              key={product.id} 
              sx={{ 
                flex: '0 0 calc(20% - 12px)', 
                minWidth: 0,
                opacity: isAnimating ? 0.7 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
              onClick={() => handleProductClick(product)}
            >
              <CardMedia
                component="img"
                height="120"
                image={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 1, textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  component="div" 
                  sx={{ 
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'text.primary'
                  }}
                >
                  {product.name}
                </Typography>
                
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    fontSize: '0.75rem'
                  }}
                >
                  {product.brand}
                </Typography>

                <Typography 
                  variant="subtitle2" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.875rem',
                    mb: 0.5
                  }}
                >
                  ₹{product.price}
                </Typography>
                
                {product.carbonSaved && (
                  <Chip 
                    label={`${product.carbonSaved}g CO₂ saved`} 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.65rem', 
                      height: '18px',
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Pagination Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, recommendations.length)} of {recommendations.length} recommendations
        </Typography>
        
        {/* Dot Indicators */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {Array.from({ length: Math.ceil(recommendations.length / itemsPerPage) }).map((_, pageIndex) => (
            <Box
              key={pageIndex}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: Math.floor(currentIndex / itemsPerPage) === pageIndex 
                  ? 'primary.main' 
                  : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.light',
                }
              }}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(pageIndex * itemsPerPage);
                  setTimeout(() => setIsAnimating(false), 300);
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductRecommendations;
