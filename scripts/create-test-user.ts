const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test user...');

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        profile: {
          create: {
            bio: 'This is a test user account for TutorTrend',
            location: 'New York, NY',
            phone: '555-123-4567'
          }
        }
      }
    });

    console.log(`Created test user with ID: ${user.id}`);
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error creating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
