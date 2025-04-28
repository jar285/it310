'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CartContextType {
  cartItemCount: number;
  updateCartCount: () => Promise<number>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartItemCount: 0,
  updateCartCount: async () => 0,
  incrementCartCount: () => {},
  decrementCartCount: () => {},
  setCartCount: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const updateCartCount = async (): Promise<number> => {
    try {
      console.log("Fetching cart count...");
      const response = await fetch('/api/cart', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      console.log("Cart data received:", data);
      const totalQuantity = data.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
      console.log("Setting cart count to:", totalQuantity);
      setCartItemCount(totalQuantity);
      return totalQuantity;
    } catch (error) {
      console.error('Error updating cart count:', error);
      return cartItemCount;
    }
  };

  const incrementCartCount = () => {
    setCartItemCount(prev => prev + 1);
  };

  const decrementCartCount = () => {
    setCartItemCount(prev => Math.max(0, prev - 1));
  };

  const setCartCount = (count: number) => {
    setCartItemCount(count);
  };

  // Initial fetch of cart count
  useEffect(() => {
    if (isAuthenticated) {
      updateCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [isAuthenticated]);

  // Set up polling to keep cart count in sync
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Update cart count every 30 seconds
    const intervalId = setInterval(() => {
      updateCartCount();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ 
      cartItemCount, 
      updateCartCount, 
      incrementCartCount,
      decrementCartCount,
      setCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}
