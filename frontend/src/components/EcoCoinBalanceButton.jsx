import React from 'react';
import { Button, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEcoCoins } from '../contexts/EcoCoinContext';

const EcoCoinBalanceButton = () => {
  const { balance, loading } = useEcoCoins();

  return (
    <Button 
      component={Link} 
      to="/wallet"
      variant="contained"
      sx={{
        backgroundColor: '#4caf50',
        color: 'white',
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#388e3c',
        },
      }}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        <>
          <span style={{ marginRight: '8px' }}>🌿</span>
          {balance} EcoCoins
        </>
      )}
    </Button>
  );
};

export default EcoCoinBalanceButton;
