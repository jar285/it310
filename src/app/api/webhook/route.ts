import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { orderRepository } from '@/lib/repositories/order-repository';
import { enrollmentRepository } from '@/lib/repositories/enrollment-repository';
import { prisma } from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    // For local development without Stripe CLI
    if (!sig || !endpointSecret) {
      console.log('No signature or endpoint secret - using payload directly');
      event = JSON.parse(payload);
    } else {
      // Verify webhook signature and extract the event.
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Log the event for debugging
  console.log(`Webhook received: ${event.type}`);
  console.log('Event data:', JSON.stringify(event.data.object, null, 2));

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      
      // Find cart items for the user
      if (paymentIntent.metadata?.userId) {
        try {
          const userId = paymentIntent.metadata.userId;
          
          // Get cart items
          const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { course: true },
          });
          
          if (cartItems.length > 0) {
            // Calculate total amount
            const totalAmount = cartItems.reduce((total, item) => {
              return total + (item.course.price * item.quantity);
            }, 0);
            
            // Create order
            const order = await orderRepository.create({
              userId,
              totalAmount,
              status: 'completed',
              paymentMethod: 'stripe',
              paymentId: paymentIntent.id,
              items: cartItems.map(item => ({
                courseId: item.course.id,
                quantity: item.quantity,
                price: item.course.price
              }))
            });
            
            // Create enrollments for each course in the order
            const enrollmentData = cartItems.map(item => ({
              userId,
              courseId: item.course.id,
              orderId: order.id
            }));
            
            // Create enrollments
            const enrollmentCount = await enrollmentRepository.createMany(enrollmentData);
            console.log(`Created ${enrollmentCount} enrollments for order ${order.id}`);
            
            // Clear cart
            await prisma.cartItem.deleteMany({
              where: { userId }
            });

            console.log(`Order created successfully for user ${userId}`);
          } else {
            console.log(`No cart items found for user ${userId}`);
          }
        } catch (error) {
          console.error('Error processing payment success:', error);
        }
      } else {
        console.log('No userId found in payment intent metadata');
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPaymentIntent.id}`);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
