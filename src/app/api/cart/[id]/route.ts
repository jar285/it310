import { NextRequest, NextResponse } from 'next/server';
import { cartRepository } from '@/lib/repositories/cart-repository';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const cartItem = await cartRepository.findById(params.id);
    
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // Ensure user can only access their own cart items
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error fetching cart item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    if (data.quantity === undefined || data.quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }
    
    // Check if cart item exists and belongs to the user
    const existingItem = await cartRepository.findById(params.id);
    
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    if (existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const updatedItem = await cartRepository.update(params.id, {
      quantity: data.quantity
    });
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if cart item exists and belongs to the user
    const existingItem = await cartRepository.findById(params.id);
    
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    if (existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await cartRepository.delete(params.id);
    
    return NextResponse.json(
      { message: 'Cart item removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
