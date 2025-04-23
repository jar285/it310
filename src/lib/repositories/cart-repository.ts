import { prisma } from '../prisma';
import { CartItem, Course } from '@prisma/client';

export type CartItemWithCourse = CartItem & {
  course: Course & {
    tutor: {
      id: string;
      specialization: string;
      user: {
        name: string | null;
      };
    };
  };
};

export const cartRepository = {
  findByUserId: async (userId: string): Promise<CartItemWithCourse[]> => {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            tutor: {
              select: {
                id: true,
                specialization: true,
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: async (id: string): Promise<CartItemWithCourse | null> => {
    return prisma.cartItem.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            tutor: {
              select: {
                id: true,
                specialization: true,
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
  },

  findByCourseAndUser: async (courseId: string, userId: string): Promise<CartItem | null> => {
    return prisma.cartItem.findFirst({
      where: {
        courseId,
        userId
      }
    });
  },

  create: async (data: {
    userId: string;
    courseId: string;
    quantity?: number;
  }): Promise<CartItem> => {
    return prisma.cartItem.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        quantity: data.quantity || 1
      }
    });
  },

  update: async (id: string, data: {
    quantity: number;
  }): Promise<CartItem> => {
    return prisma.cartItem.update({
      where: { id },
      data
    });
  },

  delete: async (id: string): Promise<CartItem> => {
    return prisma.cartItem.delete({
      where: { id }
    });
  },

  deleteByUserId: async (userId: string): Promise<{ count: number }> => {
    const result = await prisma.cartItem.deleteMany({
      where: { userId }
    });
    
    return { count: result.count };
  },

  getCartTotal: async (userId: string): Promise<number> => {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        course: true
      }
    });
    
    return cartItems.reduce((total, item) => {
      return total + (item.course.price * item.quantity);
    }, 0);
  },

  getCartCount: async (userId: string): Promise<number> => {
    const result = await prisma.cartItem.aggregate({
      where: { userId },
      _sum: {
        quantity: true
      }
    });
    
    return result._sum.quantity || 0;
  }
};
