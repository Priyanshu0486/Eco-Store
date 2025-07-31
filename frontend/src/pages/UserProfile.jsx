import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

const accountOptions = [
  {
    label: 'Edit Profile',
    icon: <PersonOutlineIcon color="primary" fontSize="medium" />,
  },
  {
    label: 'Saved Credit / Debit & Gift Cards',
    icon: <CreditCardIcon color="primary" fontSize="medium" />,
  },
  {
    label: 'Saved Addresses',
    icon: <LocationOnOutlinedIcon color="primary" fontSize="medium" />,
  },
  {
    label: 'Help Center',
    icon: <LockOpenOutlinedIcon color="primary" fontSize="medium" />,
  },
];

const UserProfile = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Account Settings
        </Typography>
        <List>
          {accountOptions.map((option, idx) => (
            <Box key={option.label}>
              <ListItem button sx={{ py: 2 }}>
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.label} primaryTypographyProps={{ fontSize: 18, fontWeight: 500 }} />
                <Typography color="text.secondary">&#8250;</Typography>
              </ListItem>
              {idx !== accountOptions.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default UserProfile;
