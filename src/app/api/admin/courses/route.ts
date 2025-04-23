import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { courseRepository } from '@/lib/repositories/course-repository';
import { Level } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || data.price === undefined || !data.level || !data.categoryId || !data.tutorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create course
    const course = await courseRepository.create({
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || null,
      level: data.level as Level,
      category: data.categoryId,
      tutorId: data.tutorId,
      duration: 0,
      published: true,
      featured: false
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
