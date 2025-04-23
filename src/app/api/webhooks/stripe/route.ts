import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Webhook secret for verifying the event
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the event with Stripe
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentFailed(failedPaymentIntent);
      break;

    // Add more event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the order associated with this payment intent
    const order = await prisma.order.findFirst({
      where: {
        paymentIntentId: paymentIntent.id,
      },
    });

    if (order) {
      // Update the order status to paid
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.PAID,
          paidAt: new Date(),
        },
      });

      console.log(`Order ${order.id} marked as paid`);
    } else {
      // If no order is found, this might be a payment that was created outside of our system
      console.log(`No order found for payment intent: ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find the order associated with this payment intent
    const order = await prisma.order.findFirst({
      where: {
        paymentIntentId: paymentIntent.id,
      },
    });

    if (order) {
      // Update the order status to failed
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.FAILED,
          lastError: paymentIntent.last_payment_error?.message || 'Payment failed',
        },
      });

      console.log(`Order ${order.id} marked as failed`);
    } else {
      console.log(`No order found for failed payment intent: ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}
