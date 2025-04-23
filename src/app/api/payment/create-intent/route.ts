import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      );
    }
    
    // Calculate total amount
    const amount = cartItems.reduce((total, item) => {
      return total + (item.course.price * item.quantity);
    }, 0);
    
    // Extract course IDs for metadata
    const courseIds = cartItems.map(item => item.course.id);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        courseIds: JSON.stringify(courseIds)
      },
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
