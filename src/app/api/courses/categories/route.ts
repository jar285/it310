import { NextRequest, NextResponse } from 'next/server';
import { courseRepository } from '@/lib/repositories/course-repository';

export async function GET() {
  try {
    const categories = await courseRepository.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching course categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course categories' },
      { status: 500 }
    );
  }
}
