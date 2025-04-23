import { prisma } from '../prisma';
import { Review, User } from '@prisma/client';

export type ReviewWithUser = Review & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export const reviewRepository = {
  findByCourseId: async (courseId: string): Promise<ReviewWithUser[]> => {
    return prisma.review.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findByTutorId: async (tutorId: string): Promise<ReviewWithUser[]> => {
    return prisma.review.findMany({
      where: { tutorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: async (id: string): Promise<ReviewWithUser | null> => {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
  },

  create: async (data: {
    userId: string;
    courseId?: string;
    tutorId?: string;
    rating: number;
    comment?: string;
  }): Promise<Review> => {
    return prisma.review.create({
      data
    });
  },

  update: async (id: string, data: {
    rating?: number;
    comment?: string;
  }): Promise<Review> => {
    return prisma.review.update({
      where: { id },
      data
    });
  },

  delete: async (id: string): Promise<Review> => {
    return prisma.review.delete({
      where: { id }
    });
  },

  findByUserAndCourse: async (userId: string, courseId: string): Promise<Review | null> => {
    return prisma.review.findFirst({
      where: {
        userId,
        courseId
      }
    });
  },

  findByUserAndTutor: async (userId: string, tutorId: string): Promise<Review | null> => {
    return prisma.review.findFirst({
      where: {
        userId,
        tutorId
      }
    });
  },

  getAverageRatingForCourse: async (courseId: string): Promise<number> => {
    const result = await prisma.review.aggregate({
      where: { courseId },
      _avg: {
        rating: true
      }
    });
    
    return result._avg.rating || 0;
  },

  getAverageRatingForTutor: async (tutorId: string): Promise<number> => {
    const result = await prisma.review.aggregate({
      where: { tutorId },
      _avg: {
        rating: true
      }
    });
    
    return result._avg.rating || 0;
  },

  updateTutorRating: async (tutorId: string): Promise<void> => {
    const avgRating = await reviewRepository.getAverageRatingForTutor(tutorId);
    
    await prisma.tutor.update({
      where: { id: tutorId },
      data: { rating: avgRating }
    });
  }
};
