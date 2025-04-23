import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { enrollmentRepository } from '@/lib/repositories/enrollment-repository';

// GET /api/enrollments - Get all enrollments for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const enrollments = await enrollmentRepository.findByUserId(userId);
    
    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Create a new enrollment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await req.json();
    
    if (!body.courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if enrollment already exists
    const existingEnrollment = await enrollmentRepository.findByUserAndCourse(
      userId,
      body.courseId
    );
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'User is already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create enrollment
    const enrollment = await enrollmentRepository.create({
      userId,
      courseId: body.courseId,
      status: body.status || 'active',
    });
    
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
