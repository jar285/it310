import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// GET /api/payment/verify - Verify a payment and ensure enrollments are created
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const paymentIntentId = request.nextUrl.searchParams.get('payment_intent');
    
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
    }
    
    console.log(`Verifying payment intent ${paymentIntentId} for user ${userId}`);
    
    // Check if order exists for this payment intent
    const order = await prisma.order.findFirst({
      where: {
        paymentIntentId,
        userId
      },
      include: {
        orderItems: {
          include: {
            course: true
          }
        }
      }
    });
    
    if (!order) {
      console.log(`No order found for payment intent ${paymentIntentId} and user ${userId}`);
      
      // Get payment intent from Stripe to verify it's valid and paid
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log(`Payment intent status: ${paymentIntent.status}`);
        
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json({
            success: false,
            message: `Payment not completed. Status: ${paymentIntent.status}`
          });
        }
        
        // Try to get cart items
        const cartItems = await prisma.cartItem.findMany({
          where: { userId },
          include: {
            course: true
          }
        });
        
        if (cartItems.length === 0) {
          console.log('No items in cart. Checking metadata from payment intent...');
          
          // If no cart items, try to get course IDs from payment intent metadata
          if (paymentIntent.metadata && paymentIntent.metadata.courseIds) {
            try {
              const courseIds = JSON.parse(paymentIntent.metadata.courseIds);
              console.log('Found course IDs in payment intent metadata:', courseIds);
              
              if (Array.isArray(courseIds) && courseIds.length > 0) {
                // Get courses by IDs
                const courses = await prisma.course.findMany({
                  where: {
                    id: {
                      in: courseIds
                    }
                  }
                });
                
                if (courses.length > 0) {
                  console.log(`Found ${courses.length} courses from metadata`);
                  
                  // Calculate total amount
                  const totalAmount = courses.reduce((total, course) => {
                    return total + course.price;
                  }, 0);
                  
                  // Create order
                  const newOrder = await prisma.order.create({
                    data: {
                      userId,
                      totalAmount,
                      status: OrderStatus.COMPLETED,
                      paymentMethod: 'card',
                      paymentIntentId,
                      orderItems: {
                        create: courses.map(course => ({
                          courseId: course.id,
                          quantity: 1,
                          price: course.price
                        }))
                      }
                    },
                    include: {
                      orderItems: true
                    }
                  });
                  
                  console.log(`Created order ${newOrder.id} for payment ${paymentIntentId}`);
                  
                  // Create enrollments for each course
                  for (const course of courses) {
                    try {
                      const existingEnrollment = await prisma.enrollment.findFirst({
                        where: {
                          userId,
                          courseId: course.id
                        }
                      });
                      
                      if (!existingEnrollment) {
                        const enrollment = await prisma.enrollment.create({
                          data: {
                            userId,
                            courseId: course.id,
                            orderId: newOrder.id,
                            status: 'active',
                          },
                        });
                        console.log(`Created enrollment ${enrollment.id} for course ${course.id}`);
                      } else {
                        console.log(`Enrollment already exists for course ${course.id}`);
                      }
                    } catch (enrollmentError) {
                      console.error(`Error creating enrollment for course ${course.id}:`, enrollmentError);
                    }
                  }
                  
                  return NextResponse.json({
                    success: true,
                    message: 'Order created successfully from payment intent metadata',
                    orderId: newOrder.id
                  });
                }
              }
            } catch (metadataError) {
              console.error('Error parsing course IDs from metadata:', metadataError);
            }
          }
          
          // If we get here, we couldn't find cart items or metadata
          return NextResponse.json({
            success: false,
            message: 'No items in cart and no order found for this payment'
          });
        }
        
        // Calculate total amount
        const totalAmount = cartItems.reduce((total, item) => {
          return total + (item.course.price * item.quantity);
        }, 0);
        
        // Create order
        const newOrder = await prisma.order.create({
          data: {
            userId,
            totalAmount,
            status: OrderStatus.COMPLETED,
            paymentMethod: 'card',
            paymentIntentId,
            orderItems: {
              create: cartItems.map(item => ({
                courseId: item.course.id,
                quantity: item.quantity,
                price: item.course.price
              }))
            }
          },
          include: {
            orderItems: true
          }
        });
        
        console.log(`Created order ${newOrder.id} for payment ${paymentIntentId}`);
        
        // Create enrollments for each course
        for (const item of cartItems) {
          try {
            const existingEnrollment = await prisma.enrollment.findFirst({
              where: {
                userId,
                courseId: item.course.id
              }
            });
            
            if (!existingEnrollment) {
              const enrollment = await prisma.enrollment.create({
                data: {
                  userId,
                  courseId: item.course.id,
                  orderId: newOrder.id,
                  status: 'active',
                },
              });
              console.log(`Created enrollment ${enrollment.id} for course ${item.course.id}`);
            } else {
              console.log(`Enrollment already exists for course ${item.course.id}`);
            }
          } catch (enrollmentError) {
            console.error(`Error creating enrollment for course ${item.course.id}:`, enrollmentError);
          }
        }
        
        // Clear cart
        await prisma.cartItem.deleteMany({
          where: { userId }
        });
        
        console.log(`Cleared cart for user ${userId}`);
        
        return NextResponse.json({
          success: true,
          message: 'Order created successfully',
          orderId: newOrder.id
        });
      } catch (stripeError) {
        console.error('Error retrieving payment intent from Stripe:', stripeError);
        return NextResponse.json({
          success: false,
          message: 'Error retrieving payment information'
        });
      }
    }
    
    // Check if enrollments exist for this order
    const orderItems = order.orderItems;
    let enrollmentsCreated = 0;
    
    for (const item of orderItems) {
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId: item.courseId,
          orderId: order.id
        }
      });
      
      if (!existingEnrollment) {
        // Create enrollment if it doesn't exist
        try {
          const enrollment = await prisma.enrollment.create({
            data: {
              userId,
              courseId: item.courseId,
              orderId: order.id,
              status: 'active',
            },
          });
          console.log(`Created enrollment ${enrollment.id} for course ${item.courseId}`);
          enrollmentsCreated++;
        } catch (enrollmentError) {
          console.error(`Error creating enrollment for course ${item.courseId}:`, enrollmentError);
        }
      } else {
        enrollmentsCreated++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Order verified successfully. ${enrollmentsCreated} enrollments confirmed.`,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
