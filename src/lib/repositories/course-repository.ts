import { prisma } from '../prisma';
import { Course, Review, Level, Prisma } from '@prisma/client';

// Define a custom type for raw query results
type RawCourseResult = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  duration: number;
  level: Level;
  category: string;
  featured: boolean;
  published: boolean;
  tutorId: string;
  createdAt: Date;
  updatedAt: Date;
  tutor_id: string;
  specialization: string;
  tutor_name: string | null;
  tutor_image: string | null;
  review_count: string;
};

export type CourseWithRelations = Course & {
  tutor?: {
    id: string;
    specialization: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
  averageRating?: number;
  featured?: boolean;
  tutorId: string; // Add tutorId to CourseWithRelations type
};

export const courseRepository = {
  findAll: async (options?: {
    take?: number;
    skip?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<CourseWithRelations[]> => {
    const { take, skip, where, orderBy } = options || {};
    
    // Use Prisma's standard query instead of raw SQL to avoid syntax issues
    const courses = await prisma.course.findMany({
      take,
      skip,
      where,
      orderBy,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    // Transform the results to match the expected CourseWithRelations type
    return courses.map(course => ({
      ...course,
      tutor: course.tutor ? {
        id: course.tutor.id,
        specialization: course.tutor.specialization,
        user: {
          name: course.tutor.user.name,
          image: course.tutor.user.image
        }
      } : undefined,
      averageRating: 0 // This would be calculated from reviews in a real app
    }));
  },

  findById: async (id: string): Promise<CourseWithRelations | null> => {
    // Use Prisma's standard query instead of raw SQL
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
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
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });
    
    if (!course) return null;
    
    // Calculate average rating
    let averageRating = 0;
    if (course.reviews.length > 0) {
      const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / course.reviews.length;
    }
    
    // Transform to match the expected type
    return {
      ...course,
      tutor: course.tutor ? {
        id: course.tutor.id,
        specialization: course.tutor.specialization,
        user: {
          name: course.tutor.user.name,
          image: course.tutor.user.image
        }
      } : undefined,
      averageRating
    };
  },

  create: async (data: {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    duration: number;
    level: Level;
    category: string;
    featured?: boolean;
    published?: boolean;
    tutorId: string;
  }): Promise<Course> => {
    return prisma.course.create({
      data
    });
  },

  update: async (id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    duration?: number;
    level?: Level;
    category?: string;
    featured?: boolean;
    published?: boolean;
  }): Promise<Course> => {
    return prisma.course.update({
      where: { id },
      data
    });
  },

  delete: async (id: string): Promise<Course> => {
    return prisma.course.delete({
      where: { id }
    });
  },

  findByTutorId: async (tutorId: string): Promise<Course[]> => {
    return prisma.course.findMany({
      where: { tutorId }
    });
  },

  findFeatured: async (limit: number = 6): Promise<CourseWithRelations[]> => {
    const courses = await prisma.course.findMany({
      where: { featured: true, published: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    // Transform to match the expected type
    return courses.map(course => ({
      ...course,
      tutor: course.tutor ? {
        id: course.tutor.id,
        specialization: course.tutor.specialization,
        user: {
          name: course.tutor.user.name,
          image: course.tutor.user.image
        }
      } : undefined,
      averageRating: 0 // This would be calculated from reviews in a real app
    }));
  },

  search: async (query: string, options?: {
    take?: number;
    skip?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    level?: Level;
  }): Promise<CourseWithRelations[]> => {
    const { take = 10, skip = 0, category, minPrice, maxPrice, level } = options || {};
    
    // Build the where clause
    const where: Prisma.CourseWhereInput = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ],
      published: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (level) {
      where.level = level;
    }
    
    const courses = await prisma.course.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    // Transform to match the expected type
    return courses.map(course => ({
      ...course,
      tutor: course.tutor ? {
        id: course.tutor.id,
        specialization: course.tutor.specialization,
        user: {
          name: course.tutor.user.name,
          image: course.tutor.user.image
        }
      } : undefined,
      averageRating: 0 // This would be calculated from reviews in a real app
    }));
  },
  
  countSearch: async (query: string, options?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    level?: Level;
  }): Promise<number> => {
    const { category, minPrice, maxPrice, level } = options || {};
    
    // Build the where clause
    const where: Prisma.CourseWhereInput = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ],
      published: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (level) {
      where.level = level;
    }
    
    return prisma.course.count({ where });
  },
  
  count: async (where: Prisma.CourseWhereInput): Promise<number> => {
    return prisma.course.count({ where });
  },

  getCategories: async (): Promise<string[]> => {
    const categories = await prisma.course.groupBy({
      by: ['category'],
      where: { published: true }
    });
    
    return categories.map(c => c.category);
  }
};
