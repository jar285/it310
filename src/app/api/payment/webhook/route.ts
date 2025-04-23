import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { orderRepository } from '@/lib/repositories/order-repository';
import { OrderStatus } from '@prisma/client';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret is not set');
    }
    
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing payment success webhook for payment intent:', paymentIntent.id);
    
    const userId = paymentIntent.metadata.userId;
    if (!userId) {
      throw new Error('User ID not found in payment intent metadata');
    }

    console.log(`Found user ID in payment intent metadata: ${userId}`);

    // Get cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });

    if (cartItems.length === 0) {
      console.log('No cart items found for user', userId);
      return;
    }

    console.log(`Found ${cartItems.length} cart items for user ${userId}`);

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.course.price * item.quantity);
    }, 0);

    console.log(`Calculated total amount: ${totalAmount}`);

    // Create order
    const order = await orderRepository.create({
      userId,
      totalAmount,
      status: OrderStatus.COMPLETED,
      paymentMethod: 'card',
      paymentIntentId: paymentIntent.id,
      items: cartItems.map(item => ({
        courseId: item.course.id,
        quantity: item.quantity,
        price: item.course.price,
      })),
    });

    console.log(`Created order ${order.id} for payment ${paymentIntent.id}`);

    // Create enrollments for each course
    for (const item of cartItems) {
      try {
        const enrollment = await prisma.enrollment.create({
          data: {
            userId,
            courseId: item.course.id,
            orderId: order.id,
            status: 'active',
          },
        });
        console.log(`Created enrollment ${enrollment.id} for course ${item.course.id}`);
      } catch (enrollmentError) {
        console.error(`Error creating enrollment for course ${item.course.id}:`, enrollmentError);
      }
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    console.log(`Cleared cart for user ${userId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}
