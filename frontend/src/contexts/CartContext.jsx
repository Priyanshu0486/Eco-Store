import React, { createContext, useState, useContext, useEffect } from 'react';
import { calculateEcoCoins } from '../utils/api';

const CartContext = createContext();

const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ cartItems: [], totalPrice: 0, totalItems: 0 });
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [ecoCoins, setEcoCoins] = useState(0);
  const [environmentalImpact, setEnvironmentalImpact] = useState({
    carbonSaved: 0,
    waterReduced: 0,
    plasticAvoided: 0
  });

  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [redemptionHistory, setRedemptionHistory] = useState([]);

  // Load non-cart data from localStorage on initial render
  useEffect(() => {
    const savedPurchases = localStorage.getItem('purchasedItems');
    const savedImpact = localStorage.getItem('environmentalImpact');
    const savedEcoCoins = localStorage.getItem('ecoCoins');
    const savedCoupons = localStorage.getItem('coupons');
    const savedRedemptionHistory = localStorage.getItem('redemptionHistory');

    if (savedPurchases) setPurchasedItems(JSON.parse(savedPurchases));
    if (savedImpact) setEnvironmentalImpact(JSON.parse(savedImpact));
    if (savedEcoCoins) setEcoCoins(JSON.parse(savedEcoCoins));
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
    if (savedRedemptionHistory) setRedemptionHistory(JSON.parse(savedRedemptionHistory));
  }, []);

  // Save non-cart data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  useEffect(() => {
    localStorage.setItem('environmentalImpact', JSON.stringify(environmentalImpact));
  }, [environmentalImpact]);

  useEffect(() => {
    localStorage.setItem('ecoCoins', JSON.stringify(ecoCoins));
  }, [ecoCoins]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('redemptionHistory', JSON.stringify(redemptionHistory));
  }, [redemptionHistory]);

  // --- Backend-driven Cart Logic ---
  const fetchCart = async () => {
    if (!user) return;
    try {
      const data = await getCart();
      setCart(data || { cartItems: [], totalPrice: 0, totalItems: 0 });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart({ cartItems: [], totalPrice: 0, totalItems: 0 }); // Reset cart on error
    }
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const addItem = async (item) => {
    if (!user) return;
    try {
      await addItemToCart(item);
      fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeItem = async (item) => {
    if (!user) return;
    try {
      await removeItemFromCart(item);
      fetchCart(); // Refresh cart from backend
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  // --- Local Logic (to be refactored or kept) ---
  const addToPurchased = (items) => {
    try {
      const purchaseDate = new Date().toISOString();
      const newPurchases = items.map(item => ({
        ...item,
        purchaseDate: item.purchaseDate || purchaseDate,
        carbonSaved: (item.carbonSaved || 0) * (item.quantity || 1),
        waterReduced: (item.waterReduced || 0) * (item.quantity || 1),
        plasticAvoided: (item.plasticItemsAvoided || 0) * (item.quantity || 1),
        image: item.image || 'https://via.placeholder.com/100',
      }));

      // Calculate impact for these items
      const impact = newPurchases.reduce((acc, item) => ({
        carbonSaved: acc.carbonSaved + (item.carbonSaved || 0),
        waterReduced: acc.waterReduced + (item.waterReduced || 0),
        plasticAvoided: acc.plasticAvoided + (item.plasticAvoided || 0),
      }), { carbonSaved: 0, waterReduced: 0, plasticAvoided: 0 });

      // Update environmental impact
      setEnvironmentalImpact(prev => ({
        carbonSaved: prev.carbonSaved + impact.carbonSaved,
        waterReduced: prev.waterReduced + impact.waterReduced,
        plasticAvoided: prev.plasticAvoided + impact.plasticAvoided,
      }));

      // Add to purchased items
      setPurchasedItems(prev => [...newPurchases, ...prev]);
      
      return { 
        success: true, 
        message: 'Items added to purchase history',
        impact,
        items: newPurchases
      };
    } catch (error) {
      console.error('Error adding to purchased items:', error);
      return { 
        success: false, 
        message: 'Failed to add to purchase history'
      };
    }
  };

  const clearCart = () => {
    // This should eventually call a backend endpoint
    setCart({ cartItems: [], totalPrice: 0, totalItems: 0 });
  };

  const checkout = () => {
    // This will be a more complex backend process
  };

  const redeemEcoCoins = (option) => {
    // This logic remains local for now
    if (ecoCoins >= option.coins) {
      let message = `Successfully redeemed ${option.label}!`;
      setEcoCoins(prev => prev - option.coins);

      const newRedemption = {
        id: Date.now(),
        date: new Date().toISOString(),
        label: option.label,
        coins: option.coins,
      };
      setRedemptionHistory(prev => [newRedemption, ...prev]);

      // ₹150 Off Coupon
      if (option.id === 2) {
        const newCoupon = {
          code: `ECO150-${generateRandomCode()}`,
          discount: 150,
          type: 'fixed',
          description: '₹150 off on your next eco-friendly purchase',
          used: false,
        };
        setCoupons(prev => [...prev, newCoupon]);
        message = `Successfully redeemed! Your coupon code is: ${newCoupon.code}`;
      }

      // ₹50 Off Coupon
      if (option.id === 1) {
        const newCoupon = {
          code: `ECO50-${generateRandomCode()}`,
          discount: 50,
          type: 'fixed',
          description: '₹50 off on your next eco-friendly purchase',
          used: false,
        };
        setCoupons(prev => [...prev, newCoupon]);
        message = `Successfully redeemed! Your coupon code is: ${newCoupon.code}`;
      }

      return { success: true, message };
    }
    return { success: false, message: 'Not enough EcoCoins!' };
  };

  const applyCoupon = (couponCode) => {
    // This logic remains local for now
    const subtotal = cart.totalPrice;
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase() && !c.used);

    if (!coupon) {
      return { success: false, message: 'Invalid or used coupon code.' };
    }

    // Check for minimum spend on fixed-amount coupons
    if (coupon.type === 'fixed' && subtotal < 300) {
      return { success: false, message: 'A minimum spend of ₹300 is required to use this coupon.' };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        purchasedItems,
        environmentalImpact,
        ecoCoins,
        coupons,
        appliedCoupon,
        redemptionHistory,
        addItem, // new
        removeItem, // new
        fetchCart, // new
        checkout,
        redeemEcoCoins,
        applyCoupon,
        removeCoupon,
        cartCount: cart.cartItems ? cart.cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0,
        clearCart,
        addToPurchased
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
