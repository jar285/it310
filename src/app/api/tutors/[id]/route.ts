import { NextRequest, NextResponse } from 'next/server';
import { tutorRepository } from '@/lib/repositories/tutor-repository';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tutor = await tutorRepository.findById(params.id);
    
    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tutor);
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tutor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    
    // Check if tutor exists
    const existingTutor = await tutorRepository.findById(params.id);
    if (!existingTutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }
    
    const tutor = await tutorRepository.update(params.id, {
      specialization: data.specialization,
      hourlyRate: data.hourlyRate !== undefined ? parseFloat(data.hourlyRate) : undefined,
      availability: data.availability,
      bio: data.bio,
      experience: data.experience !== undefined ? parseInt(data.experience) : undefined,
      education: data.education,
      location: data.location,
      latitude: data.latitude !== undefined ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude !== undefined ? parseFloat(data.longitude) : undefined
    });
    
    return NextResponse.json(tutor);
  } catch (error) {
    console.error('Error updating tutor:', error);
    return NextResponse.json(
      { error: 'Failed to update tutor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if tutor exists
    const existingTutor = await tutorRepository.findById(params.id);
    if (!existingTutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }
    
    await tutorRepository.delete(params.id);
    
    return NextResponse.json(
      { message: 'Tutor profile deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tutor:', error);
    return NextResponse.json(
      { error: 'Failed to delete tutor' },
      { status: 500 }
    );
  }
}
