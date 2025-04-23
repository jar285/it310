import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/order-repository';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const orders = await orderRepository.findByUserId(userId);
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }
    
    if (data.total === undefined || data.total <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      );
    }
    
    const userId = session.user.id;
    
    // Create order
    const order = await orderRepository.create({
      userId,
      totalAmount: data.total,
      status: OrderStatus.COMPLETED, 
      paymentMethod: data.paymentMethod || 'credit_card',
      paymentIntentId: data.paymentId || `payment_${Date.now()}`, 
      items: data.items.map((item: any) => ({
        courseId: item.courseId,
        quantity: item.quantity || 1,
        price: item.price
      }))
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
