'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Download, Mail } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import { useReactToPrint } from 'react-to-print';
import type { MouseEventHandler } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  course: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentIntentId?: string;
  createdAt: string;
  paidAt?: string;
  billingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: OrderItem[];
}

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Get the order ID directly from params
  const orderId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/orders');
      return;
    }

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, router, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fix the TypeScript error by using the correct type for useReactToPrint
  const handlePrintReceipt = useReactToPrint({
    documentTitle: `TutorTrend_Receipt_${order?.id.substring(0, 8)}`,
    // Use the correct property name for the print content
    contentRef: receiptRef,
  });

  const sendReceiptEmail = async () => {
    try {
      const response = await fetch('/api/orders/send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send receipt');
      }

      alert('Receipt sent to your email!');
    } catch (err) {
      console.error('Error sending receipt:', err);
      alert('Failed to send receipt. Please try again later.');
    }
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

  if (error || !order) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Order not found'}</h2>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create a wrapper function to handle the button click
  const handlePrintButtonClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    handlePrintReceipt();
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
            <p className="mt-2 text-lg text-gray-600">Thank you for your purchase!</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handlePrintButtonClick}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button 
              variant="outline" 
              onClick={sendReceiptEmail}
              className="flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.id.substring(0, 8)}</h2>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  <span className="mr-1.5">
                    {order.status.toLowerCase() === 'completed' ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                  </span>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Payment Method:</span> {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}</p>
                  {order.paymentIntentId && (
                    <p><span className="font-medium text-gray-700">Transaction ID:</span> {order.paymentIntentId.substring(0, 12)}...</p>
                  )}
                  {order.paidAt && (
                    <p><span className="font-medium text-gray-700">Payment Date:</span> {formatDate(order.paidAt)}</p>
                  )}
                </div>
              </div>
              
              {order.billingAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Billing Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {item.course.imageUrl ? (
                              <Image 
                                src={item.course.imageUrl} 
                                alt={item.course.title} 
                                fill
                                className="rounded-md object-cover" 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">No img</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <Link 
                              href={`/courses/${item.course.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {item.course.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Subtotal</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(order.totalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Tax</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      $0.00
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-base font-bold text-gray-900 text-right">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-gray-600">
                <p>Need help? <a href="mailto:support@tutortrend.com" className="text-primary-600 hover:text-primary-800">Contact our support team</a></p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link href="/dashboard/courses">
                  <Button>Go to My Courses</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hidden receipt for printing */}
        <div className="hidden">
          <div ref={receiptRef} className="p-8 max-w-4xl mx-auto bg-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">TutorTrend</h1>
              <p className="text-gray-600">Receipt for Order #{order.id.substring(0, 8)}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                  {order.paidAt && <p><strong>Payment Date:</strong> {formatDate(order.paidAt)}</p>}
                  <p><strong>Payment Method:</strong> {order.paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : order.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> {order.status}</p>
                  {order.paymentIntentId && <p><strong>Transaction ID:</strong> {order.paymentIntentId}</p>}
                </div>
                
                {order.billingAddress && (
                  <div>
                    <p><strong>Billing Address:</strong></p>
                    <p>{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                )}
              </div>
            </div>
            
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Course</th>
                  <th className="text-center py-2">Quantity</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.course.title}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-right py-2 font-semibold">Subtotal:</td>
                  <td className="text-right py-2">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(order.totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right py-2 font-semibold">Tax:</td>
                  <td className="text-right py-2">$0.00</td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan={2} className="text-right py-2 font-bold">Total:</td>
                  <td className="text-right py-2 font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
            
            <div className="text-center text-sm text-gray-600 mt-8">
              <p>Thank you for your purchase!</p>
              <p>For questions or support, please contact us at support@tutortrend.com</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
