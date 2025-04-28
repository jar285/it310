import { prisma } from '../prisma';
import { Tutor, Review, Course } from '@prisma/client';

export type TutorWithRelations = Tutor & {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  reviews?: (Review & { user: { name: string | null; image: string | null } })[];
  courses?: Course[];
  _count?: {
    reviews: number;
    courses: number;
  };
};

export const tutorRepository = {
  findAll: async (options?: {
    take?: number;
    skip?: number;
    where?: any;
    orderBy?: any;
  }): Promise<TutorWithRelations[]> => {
    const { take, skip, where, orderBy } = options || {};
    
    return prisma.tutor.findMany({
      take,
      skip,
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            reviews: true,
            courses: true
          }
        }
      }
    });
  },

  findById: async (id: string): Promise<TutorWithRelations | null> => {
    return prisma.tutor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        courses: true,
        _count: {
          select: {
            reviews: true,
            courses: true
          }
        }
      }
    });
  },

  findByUserId: async (userId: string): Promise<Tutor | null> => {
    return prisma.tutor.findUnique({
      where: { userId }
    });
  },

  create: async (data: {
    specialization: string;
    hourlyRate: number;
    availability?: any;
    bio: string;
    experience: number;
    education: string;
    userId: string;
    location?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<Tutor> => {
    return prisma.tutor.create({
      data
    });
  },

  update: async (id: string, data: {
    specialization?: string;
    hourlyRate?: number;
    availability?: any;
    bio?: string;
    experience?: number;
    education?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<Tutor> => {
    return prisma.tutor.update({
      where: { id },
      data
    });
  },

  delete: async (id: string): Promise<Tutor> => {
    return prisma.tutor.delete({
      where: { id }
    });
  },

  findTopRated: async (limit: number = 6): Promise<TutorWithRelations[]> => {
    return prisma.tutor.findMany({
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { reviews: true, courses: true } }
      }
    });
  },

  search: async (query: string, options?: {
    take?: number;
    skip?: number;
    specialization?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    location?: string;
    radius?: number; // in kilometers
  }): Promise<TutorWithRelations[]> => {
    const { 
      take = 10, 
      skip = 0, 
      specialization, 
      minRate, 
      maxRate, 
      minRating,
      location,
      radius
    } = options || {};
    
    // Base query conditions
    const where: any = {
      OR: [
        { specialization: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { user: { name: { contains: query, mode: 'insensitive' } } }
      ]
    };
    
    if (specialization) {
      where.specialization = { contains: specialization, mode: 'insensitive' };
    }
    
    if (minRate !== undefined || maxRate !== undefined) {
      where.hourlyRate = {};
      if (minRate !== undefined) where.hourlyRate.gte = minRate;
      if (maxRate !== undefined) where.hourlyRate.lte = maxRate;
    }
    
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }
    
    // Location-based search would ideally use PostGIS or a similar solution
    // For now, we'll do a simple filter if location is provided
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    // Note: For proper radius-based search, we would need to calculate distance
    // between coordinates. This would be better implemented with a specialized
    // geospatial database feature or service.
    
    return prisma.tutor.findMany({
      where,
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            reviews: true,
            courses: true
          }
        }
      }
    });
  },

  getSpecializations: async (): Promise<string[]> => {
    const specializations = await prisma.tutor.groupBy({
      by: ['specialization']
    });
    
    return specializations.map(s => s.specialization);
  }
};
