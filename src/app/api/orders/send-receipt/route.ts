import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get order ID from request body
    const { orderId } = await req.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            course: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // In a real application, this would send an email with the receipt
    // For now, we'll just simulate it
    console.log(`Sending receipt for order ${orderId} to ${order.user.email}`);

    // In a production environment, you would use a service like SendGrid, Mailgun, etc.
    // Example with SendGrid:
    // await sendgrid.send({
    //   to: order.user.email,
    //   from: 'receipts@tutortrend.com',
    //   subject: `TutorTrend Receipt - Order #${order.id.substring(0, 8)}`,
    //   html: generateReceiptHtml(order),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      { error: 'Failed to send receipt' },
      { status: 500 }
    );
  }
}

// This function would generate the HTML for the receipt email
// function generateReceiptHtml(order) {
//   // Generate HTML for the receipt
//   return `
//     <html>
//       <body>
//         <h1>TutorTrend Receipt</h1>
//         <p>Order #${order.id.substring(0, 8)}</p>
//         <!-- More receipt details here -->
//       </body>
//     </html>
//   `;
// }
