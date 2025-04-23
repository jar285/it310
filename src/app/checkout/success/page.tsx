'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { CheckCircle, ArrowRight, XCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    // Verify the order was processed
    const verifyOrder = async () => {
      try {
        if (!paymentIntentId) {
          setError('Payment information not found');
          setLoading(false);
          return;
        }

        console.log('Verifying payment intent:', paymentIntentId);
        
        // Check if the order exists
        const response = await fetch(`/api/payment/verify?payment_intent=${paymentIntentId}`);
        
        if (!response.ok) {
          throw new Error('Could not verify payment');
        }
        
        const data = await response.json();
        console.log('Payment verification response:', data);
        
        if (!data.success) {
          setError(data.message || 'Payment verification failed');
        } else {
          setOrderId(data.orderId);
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('There was an issue verifying your payment. Your courses may still be available in your dashboard.');
      } finally {
        // Show success page after a short delay
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    verifyOrder();
  }, [paymentIntentId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Verifying your payment...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Issue</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link 
              href="/dashboard/courses" 
              className="flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-white shadow-md hover:bg-primary-700 transition-colors"
            >
              Check My Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/courses" 
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your purchase. Your order has been processed successfully.
            </p>
            {orderId && (
              <p className="mt-2 text-sm text-gray-500">
                Order ID: {orderId.substring(0, 8)}...
              </p>
            )}
            {paymentIntentId && (
              <p className="mt-2 text-sm text-gray-500">
                Payment ID: {paymentIntentId.substring(0, 8)}...
              </p>
            )}
          </div>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">What's Next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Access Your Courses</h3>
                  <p className="text-gray-600">Your purchased courses are now available in your dashboard.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Start Learning</h3>
                  <p className="text-gray-600">Begin your learning journey with our comprehensive courses.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Get Support</h3>
                  <p className="text-gray-600">Our tutors are available to help you with any questions.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link 
              href="/dashboard/courses?from=checkout" 
              className="flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-white shadow-md hover:bg-primary-700 transition-colors"
            >
              Go to My Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/courses" 
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
