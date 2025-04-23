import { NextRequest, NextResponse } from 'next/server';
import { courseRepository } from '@/lib/repositories/course-repository';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await courseRepository.findById(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    
    // Check if course exists
    const existingCourse = await courseRepository.findById(params.id);
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const course = await courseRepository.update(params.id, {
      title: data.title,
      description: data.description,
      price: data.price !== undefined ? parseFloat(data.price) : undefined,
      imageUrl: data.imageUrl,
      duration: data.duration !== undefined ? parseInt(data.duration) : undefined,
      level: data.level,
      category: data.category,
      featured: data.featured,
      published: data.published
    });
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if course exists
    const existingCourse = await courseRepository.findById(params.id);
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    await courseRepository.delete(params.id);
    
    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
