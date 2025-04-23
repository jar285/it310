import { NextRequest, NextResponse } from 'next/server';
import { courseRepository } from '@/lib/repositories/course-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const level = searchParams.get('level');
    const sort = searchParams.get('sort') || 'featured';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    let courses;
    let total = 0;
    
    const where: any = { published: true };
    
    if (category) where.category = category;
    if (level) where.level = level;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    // Determine the ordering based on sort parameter
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        // This would require a more complex query to sort by average rating
        // For now, we'll use a placeholder
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        // For featured, prioritize featured courses, then sort by creation date
        where.featured = true;
        orderBy = { createdAt: 'desc' };
        break;
    }
    
    if (query) {
      // If there's a search query, use the search function
      courses = await courseRepository.search(query, {
        take: limit,
        skip,
        category: category || undefined,
        minPrice,
        maxPrice,
        level: level as any || undefined
      });
      
      // Count total for pagination
      total = await courseRepository.countSearch(query, {
        category: category || undefined,
        minPrice,
        maxPrice,
        level: level as any || undefined
      });
    } else {
      // Otherwise use the findAll function with filters
      courses = await courseRepository.findAll({
        take: limit,
        skip,
        where,
        orderBy
      });
      
      // Count total for pagination
      total = await courseRepository.count(where);
    }
    
    return NextResponse.json({
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.price || !data.tutorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const course = await courseRepository.create({
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl,
      duration: parseInt(data.duration || '0'),
      level: data.level,
      category: data.category,
      featured: data.featured || false,
      published: data.published || false,
      tutorId: data.tutorId
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
