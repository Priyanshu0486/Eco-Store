import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { CartProvider } from './contexts/CartContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import EcoStore from './pages/EcoStore';
import Wallet from './pages/Wallet';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OrderList from './pages/OrderList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [user, setUser] = useState({ loggedIn: false });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for a token in localStorage when the app starts
    const token = localStorage.getItem('jwt');
    if (token) {
      // If a token exists, assume the user is logged in.
      // For enhanced security, you could add a call here to verify the token with the backend.
      setUser({ loggedIn: true });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Clear the token on logout
    // Redirect to the homepage and force a refresh to clear all state
    window.location.href = '/';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {location.pathname !== '/login' && <Header user={user} onLogout={handleLogout} />}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/eco-store" element={<EcoStore user={user} />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
