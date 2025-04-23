'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CartContextType {
  cartItemCount: number;
  updateCartCount: () => Promise<void>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartItemCount: 0,
  updateCartCount: async () => {},
  incrementCartCount: () => {},
  decrementCartCount: () => {},
  setCartCount: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const updateCartCount = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          // Calculate total quantity of items in cart
          const totalQuantity = data.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
          setCartItemCount(totalQuantity);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } else {
      setCartItemCount(0);
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
