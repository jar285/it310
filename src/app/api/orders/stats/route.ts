import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/order-repository';
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
    
    // Get order statistics for the user
    const stats = await orderRepository.getOrderStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
}
