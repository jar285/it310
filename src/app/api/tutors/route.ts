import { NextRequest, NextResponse } from 'next/server';
import { tutorRepository } from '@/lib/repositories/tutor-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const specialization = searchParams.get('specialization');
    const minRate = searchParams.get('minRate') ? parseFloat(searchParams.get('minRate')!) : undefined;
    const maxRate = searchParams.get('maxRate') ? parseFloat(searchParams.get('maxRate')!) : undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;
    
    let tutors;
    
    if (query) {
      tutors = await tutorRepository.search(query, {
        take: limit,
        skip,
        specialization: specialization || undefined,
        minRate,
        maxRate,
        minRating,
        location: location || undefined,
        radius
      });
    } else {
      const where: any = {};
      
      if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
      if (minRate !== undefined || maxRate !== undefined) {
        where.hourlyRate = {};
        if (minRate !== undefined) where.hourlyRate.gte = minRate;
        if (maxRate !== undefined) where.hourlyRate.lte = maxRate;
      }
      if (minRating !== undefined) where.rating = { gte: minRating };
      if (location) where.location = { contains: location, mode: 'insensitive' };
      
      tutors = await tutorRepository.findAll({
        take: limit,
        skip,
        where,
        orderBy: { rating: 'desc' }
      });
    }
    
    return NextResponse.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tutors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.specialization || !data.hourlyRate || !data.bio || !data.userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already has a tutor profile
    const existingTutor = await tutorRepository.findByUserId(data.userId);
    if (existingTutor) {
      return NextResponse.json(
        { error: 'User already has a tutor profile' },
        { status: 400 }
      );
    }
    
    const tutor = await tutorRepository.create({
      specialization: data.specialization,
      hourlyRate: parseFloat(data.hourlyRate),
      availability: data.availability || {},
      bio: data.bio,
      experience: parseInt(data.experience || '0'),
      education: data.education || '',
      userId: data.userId,
      location: data.location,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined
    });
    
    return NextResponse.json(tutor, { status: 201 });
  } catch (error) {
    console.error('Error creating tutor profile:', error);
    return NextResponse.json(
      { error: 'Failed to create tutor profile' },
      { status: 500 }
    );
  }
}
