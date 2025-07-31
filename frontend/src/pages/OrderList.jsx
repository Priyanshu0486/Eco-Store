import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function OrderList() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Orders
      </Typography>
      <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="body1">
          placeholder page.
        </Typography>
      </Box>
    </Container>
  );
}

export default OrderList;
