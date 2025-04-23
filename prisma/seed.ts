import { PrismaClient, Level, OrderStatus, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');
    
    // Create users
    const adminPassword = await hash('admin123', 10);
    const userPassword = await hash('user123', 10);
    
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tutortrend.com' },
      update: {},
      create: {
        email: 'admin@tutortrend.com',
        name: 'Admin User',
        password: adminPassword,
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        profile: {
          create: {
            bio: 'Administrator of TutorTrend platform',
            phoneNumber: '555-123-4567'
          }
        }
      }
    });
    
    // Create regular users
    const user1 = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        password: userPassword,
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        profile: {
          create: {
            bio: 'Passionate learner',
            phoneNumber: '555-987-6543'
          }
        }
      }
    });
    
    const user2 = await prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: userPassword,
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        profile: {
          create: {
            bio: 'Lifelong student',
            phoneNumber: '555-456-7890'
          }
        }
      }
    });
    
    // Create tutor 1
    const tutor1 = await prisma.user.upsert({
      where: { email: 'tutor1@example.com' },
      update: {},
      create: {
        email: 'tutor1@example.com',
        name: 'Alex Johnson',
        password: await hash('tutor123', 10),
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        profile: {
          create: {
            bio: 'Experienced educator',
            phoneNumber: '555-222-3333'
          }
        }
      }
    });
    
    // Create tutor profile 1 using raw SQL to avoid type issues
    await prisma.$executeRaw`
      INSERT INTO "Tutor" (id, "userId", specialization, "hourlyRate", bio, experience, education, rating, location, latitude, longitude, availability, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${tutor1.id},
        'Mathematics',
        45.0,
        'Mathematics expert with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.',
        10,
        'PhD in Mathematics, Stanford University',
        4.8,
        'New York, NY',
        40.7128,
        -74.0060,
        ${Prisma.raw(`'${JSON.stringify({
          monday: ['09:00-12:00', '13:00-17:00'],
          tuesday: ['09:00-12:00', '13:00-17:00'],
          wednesday: ['09:00-12:00', '13:00-17:00'],
          thursday: ['09:00-12:00', '13:00-17:00'],
          friday: ['09:00-12:00', '13:00-17:00']
        })}'::jsonb`)},
        NOW(),
        NOW()
      )
    `;
    
    // Get tutor profile 1
    const tutorProfile1 = await prisma.tutor.findUnique({
      where: { userId: tutor1.id }
    });
    
    if (!tutorProfile1) {
      throw new Error('Failed to create tutor profile 1');
    }
    
    // Create tutor 2
    const tutor2 = await prisma.user.upsert({
      where: { email: 'tutor2@example.com' },
      update: {},
      create: {
        email: 'tutor2@example.com',
        name: 'Emily Chen',
        password: await hash('tutor123', 10),
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        profile: {
          create: {
            bio: 'Passionate about teaching',
            phoneNumber: '555-444-5555'
          }
        }
      }
    });
    
    // Create tutor profile 2 using raw SQL
    await prisma.$executeRaw`
      INSERT INTO "Tutor" (id, "userId", specialization, "hourlyRate", bio, experience, education, rating, location, latitude, longitude, availability, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${tutor2.id},
        'Computer Science',
        50.0,
        'Software engineer and educator with expertise in web development, algorithms, and data structures.',
        8,
        'MS in Computer Science, MIT',
        4.9,
        'San Francisco, CA',
        37.7749,
        -122.4194,
        ${Prisma.raw(`'${JSON.stringify({
          monday: ['10:00-18:00'],
          wednesday: ['10:00-18:00'],
          friday: ['10:00-18:00']
        })}'::jsonb`)},
        NOW(),
        NOW()
      )
    `;
    
    // Get tutor profile 2
    const tutorProfile2 = await prisma.tutor.findUnique({
      where: { userId: tutor2.id }
    });
    
    if (!tutorProfile2) {
      throw new Error('Failed to create tutor profile 2');
    }
    
    // Create tutor 3
    const tutor3 = await prisma.user.upsert({
      where: { email: 'tutor3@example.com' },
      update: {},
      create: {
        email: 'tutor3@example.com',
        name: 'Michael Brown',
        password: await hash('tutor123', 10),
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        profile: {
          create: {
            bio: 'Physics enthusiast',
            phoneNumber: '555-666-7777'
          }
        }
      }
    });
    
    // Create tutor profile 3 using raw SQL
    await prisma.$executeRaw`
      INSERT INTO "Tutor" (id, "userId", specialization, "hourlyRate", bio, experience, education, rating, location, latitude, longitude, availability, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${tutor3.id},
        'Physics',
        55.0,
        'Theoretical physicist with a passion for teaching complex concepts in an accessible way.',
        12,
        'PhD in Physics, Caltech',
        4.7,
        'Los Angeles, CA',
        34.0522,
        -118.2437,
        ${Prisma.raw(`'${JSON.stringify({
          tuesday: ['09:00-17:00'],
          thursday: ['09:00-17:00'],
          saturday: ['10:00-15:00']
        })}'::jsonb`)},
        NOW(),
        NOW()
      )
    `;
    
    // Get tutor profile 3
    const tutorProfile3 = await prisma.tutor.findUnique({
      where: { userId: tutor3.id }
    });
    
    if (!tutorProfile3) {
      throw new Error('Failed to create tutor profile 3');
    }
    
    // Create courses using raw SQL to handle featured field
    const course1Id = await prisma.$queryRaw<{id: string}[]>`
      INSERT INTO "Course" (id, title, description, price, "imageUrl", duration, level, category, featured, published, "tutorId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        'Calculus Fundamentals', 
        'A comprehensive introduction to differential and integral calculus.', 
        99.99, 
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', 
        1200, 
        'BEGINNER', 
        'Mathematics', 
        true, 
        true, 
        ${tutorProfile1.id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `;
    
    const course1 = await prisma.course.findUnique({
      where: { id: course1Id[0].id }
    });
    
    if (!course1) {
      throw new Error('Failed to create course 1');
    }
    
    // Create course 2 using raw SQL to avoid type issues
    const course2Id = await prisma.$queryRaw<{id: string}[]>`
      INSERT INTO "Course" (id, title, description, price, "imageUrl", duration, level, category, featured, published, "tutorId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        'Advanced Statistics', 
        'Master statistical analysis techniques for data science and research.', 
        109.99, 
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 
        1500, 
        'ADVANCED', 
        'Mathematics', 
        false, 
        true, 
        ${tutorProfile1.id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `;
    
    const course2 = await prisma.course.findUnique({
      where: { id: course2Id[0].id }
    });
    
    if (!course2) {
      throw new Error('Failed to create course 2');
    }
    
    // Create course 3 with featured flag
    const course3Id = await prisma.$queryRaw<{id: string}[]>`
      INSERT INTO "Course" (id, title, description, price, "imageUrl", duration, level, category, featured, published, "tutorId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        'Full-Stack Web Development Bootcamp', 
        'Learn to build modern web applications from front to back end.', 
        149.99, 
        'https://images.unsplash.com/photo-1593720213428-28a5b9e94613', 
        3600, 
        'INTERMEDIATE', 
        'Web Development', 
        true, 
        true, 
        ${tutorProfile2.id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `;
    
    const course3 = await prisma.course.findUnique({
      where: { id: course3Id[0].id }
    });
    
    if (!course3) {
      throw new Error('Failed to create course 3');
    }
    
    // Create course 4 with featured flag
    const course4Id = await prisma.$queryRaw<{id: string}[]>`
      INSERT INTO "Course" (id, title, description, price, "imageUrl", duration, level, category, featured, published, "tutorId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        'Data Structures and Algorithms', 
        'Master essential computer science concepts for coding interviews and software development.', 
        129.99, 
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb', 
        1800, 
        'INTERMEDIATE', 
        'Computer Science', 
        true, 
        true, 
        ${tutorProfile2.id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `;
    
    const course4 = await prisma.course.findUnique({
      where: { id: course4Id[0].id }
    });
    
    if (!course4) {
      throw new Error('Failed to create course 4');
    }
    
    // Create course 5 using raw SQL
    const course5Id = await prisma.$queryRaw<{id: string}[]>`
      INSERT INTO "Course" (id, title, description, price, "imageUrl", duration, level, category, featured, published, "tutorId", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        'Quantum Physics', 
        'Explore the fascinating world of quantum mechanics and its applications.', 
        119.99, 
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', 
        1500, 
        'ADVANCED', 
        'Physics', 
        false, 
        true, 
        ${tutorProfile3.id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `;
    
    const course5 = await prisma.course.findUnique({
      where: { id: course5Id[0].id }
    });
    
    if (!course5) {
      throw new Error('Failed to create course 5');
    }
    
    // Create reviews
    await prisma.review.createMany({
      data: [
        {
          userId: user1.id,
          courseId: course2.id,
          rating: 5,
          comment: 'Excellent course! The instructor explains complex concepts very clearly.'
        },
        {
          userId: user2.id,
          courseId: course2.id,
          rating: 4,
          comment: 'Very helpful course with good examples.'
        },
        {
          userId: user1.id,
          courseId: course3.id,
          rating: 5,
          comment: 'This bootcamp transformed my career! Highly recommended.'
        },
        {
          userId: user2.id,
          tutorId: tutorProfile1.id,
          rating: 5,
          comment: 'Alex is an amazing tutor. Very patient and knowledgeable.'
        },
        {
          userId: user1.id,
          tutorId: tutorProfile2.id,
          rating: 5,
          comment: 'Emily is fantastic! She explains programming concepts very clearly.'
        }
      ]
    });
    
    // Create cart items
    await prisma.cartItem.create({
      data: {
        userId: user1.id,
        courseId: course2.id,
        quantity: 1
      }
    });
    
    await prisma.cartItem.create({
      data: {
        userId: user1.id,
        courseId: course5.id,
        quantity: 1
      }
    });
    
    // Create orders using raw SQL to handle totalAmount
    // Generate a UUID for the first order
    const order1Id = await prisma.$queryRaw<{id: string}[]>`SELECT gen_random_uuid() as id`;
    const order1UUID = order1Id[0].id;
    
    // Create first order
    await prisma.$executeRaw`
      INSERT INTO "Order" (id, "totalAmount", status, "paymentMethod", "paymentId", "userId", "createdAt", "updatedAt")
      VALUES (
        ${order1UUID}, 
        149.99, 
        'COMPLETED', 
        'credit_card', 
        ${`pi_${Math.random().toString(36).substring(2, 15)}`}, 
        ${user1.id}, 
        NOW(), 
        NOW()
      )
    `;
    
    // Add order items for first order
    await prisma.orderItem.create({
      data: {
        orderId: order1UUID,
        courseId: course3.id,
        quantity: 1,
        price: 149.99
      }
    });
    
    // Generate a UUID for the second order
    const order2Id = await prisma.$queryRaw<{id: string}[]>`SELECT gen_random_uuid() as id`;
    const order2UUID = order2Id[0].id;
    
    // Create second order
    await prisma.$executeRaw`
      INSERT INTO "Order" (id, "totalAmount", status, "paymentMethod", "paymentId", "userId", "createdAt", "updatedAt")
      VALUES (
        ${order2UUID}, 
        229.98, 
        'COMPLETED', 
        'credit_card', 
        ${`pi_${Math.random().toString(36).substring(2, 15)}`}, 
        ${user2.id}, 
        NOW(), 
        NOW()
      )
    `;
    
    // Add order items for second order
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order2UUID,
          courseId: course1.id,
          quantity: 1,
          price: 99.99
        },
        {
          orderId: order2UUID,
          courseId: course4.id,
          quantity: 1,
          price: 129.99
        }
      ]
    });
    
    console.log('Database seeded successfully!');
    console.log(`Created ${await prisma.user.count()} users`);
    console.log(`Created ${await prisma.tutor.count()} tutors`);
    console.log(`Created ${await prisma.course.count()} courses`);
    console.log(`Created ${await prisma.review.count()} reviews`);
    console.log(`Created ${await prisma.cartItem.count()} cart items`);
    console.log(`Created ${await prisma.order.count()} orders`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
