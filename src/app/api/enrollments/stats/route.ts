import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enrollmentRepository } from '@/lib/repositories/enrollment-repository';

// GET /api/enrollments/stats - Get enrollment statistics for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const stats = await enrollmentRepository.getStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment statistics' },
      { status: 500 }
    );
  }
}
