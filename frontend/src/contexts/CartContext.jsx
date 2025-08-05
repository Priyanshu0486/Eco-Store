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
  // Initialize cart from localStorage so items persist across page refreshes
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  // Initialize purchase history and ecoCoins from localStorage so they persist across refresh
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [ecoCoins, setEcoCoins] = useState(0);
  // Initialize cumulative environmental impact from localStorage so totals and charts persist
  const [environmentalImpact, setEnvironmentalImpact] = useState({
    carbonSaved: 0,
    waterReduced: 0,
    plasticAvoided: 0
  });

  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [redemptionHistory, setRedemptionHistory] = useState(() => {
    const savedHistory = localStorage.getItem('redemptionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart'); // still load for backward compatibility but will rarely run
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('redemptionHistory', JSON.stringify(redemptionHistory));
  }, [redemptionHistory]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

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
    setCart([]);
  };

  const checkout = () => {
    const newPurchasedItems = cart.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString().split('T')[0],
      carbonSaved: (item.carbonSaved || 0) * item.quantity,
      waterReduced: (item.waterReduced || 0) * item.quantity,
      plasticAvoided: (item.plasticItemsAvoided || 0) * item.quantity
    }));

    const carbonSaved = cart.reduce((total, item) => total + (item.carbonSaved * item.quantity), 0);
    const waterReduced = cart.reduce((total, item) => total + (item.waterReduced * item.quantity), 0);
    const plasticAvoided = cart.reduce((total, item) => total + ((item.plasticItemsAvoided || 0) * item.quantity), 0);

    setEnvironmentalImpact(prev => ({
      carbonSaved: prev.carbonSaved + carbonSaved,
      waterReduced: prev.waterReduced + waterReduced,
      plasticAvoided: prev.plasticAvoided + plasticAvoided
    }));

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const earnedEcoCoins = cart.reduce((total, item) => {
      const coinsPerItem = calculateEcoCoins(item.price);
      return total + coinsPerItem * item.quantity;
    }, 0);
    setEcoCoins(prev => prev + earnedEcoCoins);

    if (appliedCoupon && newPurchasedItems.length > 0) {
      const discountAmount = appliedCoupon.type === 'fixed'
        ? Math.min(appliedCoupon.discount, subtotal)
        : (subtotal * appliedCoupon.discount) / 100;

      newPurchasedItems[0].couponDiscount = discountAmount;

      setCoupons(prevCoupons =>
        prevCoupons.map(c =>
          c.code === appliedCoupon.code ? { ...c, used: true } : c
        )
      );
      setAppliedCoupon(null);
    }

    setPurchasedItems(prev => [...prev, ...newPurchasedItems]);
    setCart([]);
  };

  const redeemEcoCoins = (option) => {
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
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        checkout,
        redeemEcoCoins,
        applyCoupon,
        removeCoupon,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
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
