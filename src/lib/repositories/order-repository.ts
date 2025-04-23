import { prisma } from '../prisma';
import { Order, OrderItem, OrderStatus } from '@prisma/client';

export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    course: {
      id: string;
      title: string;
      imageUrl: string | null;
      tutorId: string;
    };
  })[];
};

export const orderRepository = {
  findByUserId: async (userId: string): Promise<OrderWithItems[]> => {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                tutorId: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: async (id: string): Promise<OrderWithItems | null> => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                tutorId: true
              }
            }
          }
        }
      }
    });
  },

  create: async (data: {
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod?: string;
    paymentIntentId?: string;
    billingAddress?: any;
    items: Array<{
      courseId: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<Order> => {
    return prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        status: data.status,
        paymentMethod: data.paymentMethod,
        paymentIntentId: data.paymentIntentId,
        billingAddress: data.billingAddress,
        orderItems: {
          create: data.items.map(item => ({
            courseId: item.courseId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
  },

  update: async (id: string, data: {
    status?: OrderStatus;
    paymentIntentId?: string;
    billingAddress?: any;
    paidAt?: Date;
  }): Promise<Order> => {
    return prisma.order.update({
      where: { id },
      data
    });
  },

  getOrderStats: async (userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
  }> => {
    const totalOrders = await prisma.order.count({
      where: { userId }
    });
    
    const totalSpentResult = await prisma.order.aggregate({
      where: {
        userId,
        status: OrderStatus.COMPLETED
      },
      _sum: {
        totalAmount: true
      }
    });
    
    const completedOrders = await prisma.order.count({
      where: {
        userId,
        status: OrderStatus.COMPLETED
      }
    });
    
    return {
      totalOrders,
      totalSpent: totalSpentResult._sum.totalAmount || 0,
      completedOrders
    };
  }
};
