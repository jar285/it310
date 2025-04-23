'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError 
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
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
        },
      });

      if (error) {
        setCardError(error.message || 'An error occurred with your payment');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setCardError('Payment processing failed. Please try again.');
        onError('Payment processing failed');
      }
    } catch (err: any) {
      setCardError(err.message || 'An unexpected error occurred');
      onError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
          Card details
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
          <p className="text-sm text-red-600">{cardError}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)}`
        )}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Your payment is secured by Stripe</p>
        <div className="mt-2 flex justify-center space-x-2">
          <svg className="h-6" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <g fillRule="nonzero">
                <path d="M26.58 21H2.42A2.4 2.4 0 0 1 0 18.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v16.24A2.4 2.4 0 0 1 26.58 21z" fill="#E6E6E6"/>
                <path d="M10.5 7.02v-.77c0-.28-.24-.46-.47-.46H8.28c-.23 0-.47.18-.47.46v1.8c0 .27.24.45.47.45h1.75c.23 0 .47-.18.47-.45v-.77l-.5-.26zm2.74-1.23h-1.22c-.1 0-.19.08-.19.18v.26c-.2-.26-.54-.44-.96-.44H8.28c-.74 0-1.34.6-1.34 1.33v1.8c0 .74.6 1.33 1.34 1.33h2.59c.42 0 .77-.18.96-.44v.26c0 .1.08.18.19.18h1.22c.1 0 .19-.08.19-.18V6c0-.1-.08-.19-.19-.19zm1.82 0h-1.25c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.2.18h1.24c.1 0 .19-.08.19-.18V5.98c0-.1-.09-.19-.19-.19zm1.77 0h-1.25c-.1 0-.19.08-.19.19v2.37c0 .1.09.18.2.18h1.24c.1 0 .19-.08.19-.18V5.98c0-.1-.09-.19-.19-.19zm0 3.44h-1.25c-.1 0-.19.08-.19.18v1.24c0 .1.09.18.2.18h1.24c.1 0 .19-.08.19-.18V9.23c0-.1-.09-.18-.19-.18zm1.88-3.44h-1.24c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.19.18h1.24c.11 0 .19-.08.19-.18V5.98c0-.1-.08-.19-.19-.19zm2.76 0h-1.23c-.1 0-.19.08-.19.18v.26c-.2-.26-.54-.44-.96-.44h-1.23c-.1 0-.19.08-.19.19v4.68c0 .1.08.18.19.18h1.24c.1 0 .19-.08.19-.18V7.93c0-.28.24-.46.47-.46h.52c.24 0 .48.18.48.46v2.73c0 .1.08.18.19.18h1.23c.1 0 .19-.08.19-.18V7.93c0-.74-.6-1.33-1.34-1.33h-.52c-.06 0-.12 0-.18.02v-.64c0-.1-.09-.19-.19-.19z" fill="#231F20"/>
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
  );
}
