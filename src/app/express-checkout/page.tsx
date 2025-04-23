'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import StripeProvider from '@/components/payment/stripe-provider';
import EnhancedStripeForm from '@/components/payment/enhanced-stripe-form';
import { useCart } from '@/context/cart-context';

interface CartItem {
  id: string;
  quantity: number;
  course: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  };
}

export default function ExpressCheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/express-checkout');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
      // Initialize payment intent
      initializePayment();
    }
  }, [status, router, session]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCartItems(data.items);
      setCartTotal(data.total);
      
      // Redirect to cart if empty
      if (data.items.length === 0) {
        router.push('/cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = async () => {
    try {
      setProcessingPayment(true);
      
      // Create payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      console.error('Error initializing payment:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Show success message without waiting for order creation
      // The webhook will handle order creation in the background
      
      // Clear cart from UI
      setCartItems([]);
      setCartTotal(0);
      
      // Update cart count
      await updateCartCount();
      
      // Show success message
      router.push('/checkout/success?payment_intent=' + paymentIntentId);
    } catch (err) {
      console.error('Error after payment:', err);
      setError('There was an issue processing your order. Please contact support.');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(`Payment failed: ${errorMessage}`);
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <Link href="/cart">
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md">
                  Return to Cart
                </button>
              </Link>
              <button 
                onClick={() => {
                  setError(null);
                  initializePayment();
                }}
                className="border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
              
              {clientSecret ? (
                <StripeProvider>
                  <EnhancedStripeForm
                    clientSecret={clientSecret}
                    amount={cartTotal}
                    cartItems={cartItems}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              ) : (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
