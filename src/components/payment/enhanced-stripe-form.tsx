'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface CartItem {
  id: string;
  quantity: number;
  course: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string | null;
  };
}

interface EnhancedStripeFormProps {
  clientSecret: string;
  amount: number;
  cartItems: CartItem[];
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function EnhancedStripeForm({
  clientSecret,
  amount,
  cartItems,
  onSuccess,
  onError,
}: EnhancedStripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { updateCartCount, setCartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Billing details state
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  // Handle billing details changes
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BillingDetails] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate the form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!billingDetails.name.trim()) errors['name'] = 'Name is required';
    if (!billingDetails.email.trim()) errors['email'] = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(billingDetails.email)) errors['email'] = 'Valid email is required';
    if (!billingDetails.phone.trim()) errors['phone'] = 'Phone is required';
    if (!billingDetails.address.line1.trim()) errors['address.line1'] = 'Address is required';
    if (!billingDetails.address.city.trim()) errors['address.city'] = 'City is required';
    if (!billingDetails.address.state.trim()) errors['address.state'] = 'State is required';
    if (!billingDetails.address.postal_code.trim()) errors['address.postal_code'] = 'ZIP/Postal code is required';
    
    // Terms acceptance validation
    if (!termsAccepted) errors['terms'] = 'You must accept the terms and conditions';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: billingDetails.address
          }
        },
      });

      if (error) {
        setCardError(error.message || 'An error occurred during payment processing');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Clear cart items on the client side
        try {
          // Clear cart on the server
          await fetch('/api/cart', {
            method: 'DELETE',
          });
          
          // Reset cart count to 0
          setCartCount(0);
          
          // Call onSuccess callback
          onSuccess(paymentIntent.id);
        } catch (clearCartError) {
          console.error('Error clearing cart:', clearCartError);
          // Still consider the payment successful even if cart clearing fails
          onSuccess(paymentIntent.id);
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setCardError(err.message || 'An unexpected error occurred');
      onError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{item.course.title}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(item.course.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Billing Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={billingDetails.name}
                onChange={handleBillingChange}
                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
              {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={billingDetails.email}
                onChange={handleBillingChange}
                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="john.doe@example.com"
              />
              {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={billingDetails.phone}
                onChange={handleBillingChange}
                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="(123) 456-7890"
              />
              {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                id="address.line1"
                name="address.line1"
                value={billingDetails.address.line1}
                onChange={handleBillingChange}
                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="123 Main St"
              />
              {formErrors['address.line1'] && <p className="text-red-600 text-sm mt-1">{formErrors['address.line1']}</p>}
            </div>
            
            <div>
              <label htmlFor="address.line2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="address.line2"
                name="address.line2"
                value={billingDetails.address.line2}
                onChange={handleBillingChange}
                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Apt 4B"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={billingDetails.address.city}
                  onChange={handleBillingChange}
                  className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="New York"
                />
                {formErrors['address.city'] && <p className="text-red-600 text-sm mt-1">{formErrors['address.city']}</p>}
              </div>
              
              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={billingDetails.address.state}
                  onChange={handleBillingChange}
                  className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="NY"
                />
                {formErrors['address.state'] && <p className="text-red-600 text-sm mt-1">{formErrors['address.state']}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="address.postal_code"
                  name="address.postal_code"
                  value={billingDetails.address.postal_code}
                  onChange={handleBillingChange}
                  className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="10001"
                />
                {formErrors['address.postal_code'] && <p className="text-red-600 text-sm mt-1">{formErrors['address.postal_code']}</p>}
              </div>
              
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="address.country"
                  name="address.country"
                  value={billingDetails.address.country}
                  onChange={handleBillingChange}
                  className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Card Element */}
          <div className="mt-6">
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="p-3 border rounded-md shadow-sm focus-within:ring-1 focus-within:ring-primary-600 focus-within:border-primary-600">
              <CardElement 
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            {cardError && (
              <p className="text-sm text-red-600 mt-1">{cardError}</p>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="mt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">Terms and Conditions</a> and <a href="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">Privacy Policy</a>
                </label>
              </div>
            </div>
            {formErrors.terms && <p className="text-red-600 text-sm mt-1">{formErrors.terms}</p>}
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(amount)}`
            )}
          </Button>
          
          {/* Security Badges */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Your payment is secured by Stripe</p>
            <div className="mt-2 flex justify-center space-x-2">
              <svg className="h-6" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <g fillRule="nonzero">
                    <path d="M26.58 21H2.42A2.4 2.4 0 0 1 0 18.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v16.24A2.4 2.4 0 0 1 26.58 21z" fill="#E6E6E6"/>
                    <path d="M10.5 7.02v-.77c0-.28-.24-.46-.47-.46H8.28c-.23 0-.47.18-.47.46v1.8c0 .27.24.45.47.45h1.75c.23 0 .47-.18.47-.45v-.77l-.5-.26zm2.74-1.23h-1.22c-.1 0-.19.08-.19.18v.26c-.2-.26-.54-.44-.96-.44H8.28c-.74 0-1.34.6-1.34 1.33v1.8c0 .74.6 1.33 1.34 1.33h2.59c.42 0 .77-.18.96-.44v.26c0 .1.08.18.19.18h1.22c.1 0 .19-.08.19-.18V6c0-.1-.08-.19-.19-.19zm1.82 0h-1.25c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.2.18h1.24c.1 0 .19-.08.19-.18V5.98c0-.1-.09-.19-.19-.19zm1.77 0h-1.25c-.1 0-.19.08-.19.19v2.37c0 .1.09.18.2.18h1.24c.1 0 .19-.08.19-.18V5.98c0-.1-.09-.19-.19-.19zm0 3.44h-1.25c-.1 0-.19.08-.19.18v1.24c0 .1.09.18.2.18h1.24c.1 0 .19-.08.19-.18V9.23c0-.1-.09-.18-.19-.18zm1.88-3.44h-1.24c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.19.18h1.24c.11 0 .19-.08.19-.18V5.98c0-.1-.08-.19-.19-.19zm2.76 0h-1.23c-.1 0-.19.08-.19.18v.26c-.2-.26-.54-.44-.96-.44h-1.23c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.19.18h1.24c.1 0 .19-.08.19-.18V7.93c0-.28.24-.46.47-.46h.52c.24 0 .48.18.48.46v2.73c0 .1.08.18.19.18h1.23c.1 0 .19-.08.19-.18V7.93c0-.74-.6-1.33-1.34-1.33h-.52c-.06 0-.12 0-.18.02v-.64c0-.1-.09-.19-.19-.19z" fill="#231F20"/>
                    <path d="M23 19c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6z" fill="#231F20"/>
                    <path d="M23.87 5.79h-2.59c-.74 0-1.34.6-1.34 1.33v1.8c0 .74.6 1.33 1.34 1.33h2.59c.74 0 1.34-.6 1.34-1.33v-1.8c0-.74-.6-1.33-1.34-1.33zm.47 3.13c0 .28-.24.46-.47.46h-2.59c-.23 0-.47-.18-.47-.46v-1.8c0-.28.24-.46.47-.46h2.59c.23 0 .47.18.47.46v1.8z" fill="#231F20"/>
                    <path d="M23.87 6.79h-2.59c-.23 0-.47.18-.47.46v1.8c0 .28.24.46.47.46h2.59c.23 0 .47-.18.47-.46v-1.8c0-.28-.24-.46-.47-.46zm-.85.88c.26 0 .47.2.47.47a.47.47 0 0 1-.47.46.47.47 0 0 1-.47-.46c0-.26.2-.47.47-.47z" fill="#231F20"/>
                  </g>
                  <path d="M30 5.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-12z" fill="#F16522"/>
                </g>
              </svg>
              <svg className="h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                  <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
                  <path d="M15 19c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6z" fill="#EB001B"/>
                  <path d="M23 19c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6z" fill="#F79E1B"/>
                  <path d="M22 12c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3 3-1.3 3-3z" fill="#FF5F00"/>
                </g>
              </svg>
              <svg className="h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                  <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
                  <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
                </g>
              </svg>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
