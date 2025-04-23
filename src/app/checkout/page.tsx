'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/main-layout';
import StripeProvider from '@/components/payment/stripe-provider';
import StripePaymentForm from '@/components/payment/stripe-payment-form';

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

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Billing info, 2: Payment
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
      // Pre-fill email if available from session
      if (session.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: session.user?.email || '',
          fullName: session.user?.name || '',
        }));
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate billing form
    if (!formData.fullName || !formData.email || !formData.billingAddress || 
        !formData.city || !formData.state || !formData.zipCode) {
      setError('Please fill in all required fields');
      return;
    }
    
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
      
      // Move to payment step
      setPaymentStep(2);
    } catch (err: any) {
      console.error('Error initializing payment:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            courseId: item.course.id,
            quantity: item.quantity,
            price: item.course.price
          })),
          total: cartTotal,
          paymentMethod: 'stripe',
          paymentIntentId,
          billingAddress: {
            fullName: formData.fullName,
            address: formData.billingAddress,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          }
        }),
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      const orderData = await orderResponse.json();
      
      // Clear cart
      await fetch('/api/cart', {
        method: 'DELETE',
      });
      
      // Redirect to order confirmation
      router.push(`/orders/${orderData.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Payment was successful, but we could not create your order. Please contact support.');
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

  if (error && !cartItems.length) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {paymentStep === 1 ? 'Billing Information' : 'Payment Details'}
                </h2>
              </div>
              
              {paymentStep === 1 ? (
                <div className="p-6">
                  {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleBillingSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
                        Billing Address
                      </label>
                      <div className="mt-1">
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          type="text"
                          autoComplete="street-address"
                          required
                          value={formData.billingAddress}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="address-level2"
                            required
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            autoComplete="address-level1"
                            required
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP / Postal Code
                        </label>
                        <div className="mt-1">
                          <Input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            autoComplete="postal-code"
                            required
                            value={formData.zipCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          name="country"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          'Continue to Payment'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6">
                  {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
                    <p className="text-sm text-gray-600">{formData.fullName}</p>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                    <p className="text-sm text-gray-600">{formData.billingAddress}</p>
                    <p className="text-sm text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p className="text-sm text-gray-600">{formData.country}</p>
                    <button 
                      onClick={() => setPaymentStep(1)}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <StripeProvider>
                    <StripePaymentForm 
                      clientSecret={clientSecret}
                      amount={cartTotal}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </StripeProvider>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {item.course.imageUrl ? (
                        <Image 
                          src={item.course.imageUrl} 
                          alt={item.course.title} 
                          fill 
                          className="object-cover rounded" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.course.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.course.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(cartTotal)}
                  </span>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(cartTotal)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/cart" className="text-sm text-primary-600 hover:text-primary-700">
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
