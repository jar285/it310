import { NextRequest, NextResponse } from 'next/server';
import { cartRepository } from '@/lib/repositories/cart-repository';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
    const cartItems = await cartRepository.findByUserId(userId);
    const cartTotal = await cartRepository.getCartTotal(userId);
    
    return NextResponse.json({
      items: cartItems,
      total: cartTotal
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
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
    
    if (!data.courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    const userId = session.user.id;
    
    // Check if item already exists in cart
    const existingItem = await cartRepository.findByCourseAndUser(data.courseId, userId);
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedItem = await cartRepository.update(existingItem.id, {
        quantity: existingItem.quantity + (data.quantity || 1)
      });
      
      return NextResponse.json(updatedItem, { status: 200 });
    }
    
    // Create new cart item
    const cartItem = await cartRepository.create({
      userId,
      courseId: data.courseId,
      quantity: data.quantity || 1
    });
    
    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const result = await cartRepository.deleteByUserId(userId);
    
    return NextResponse.json({
      message: `Cleared ${result.count} items from cart`
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
