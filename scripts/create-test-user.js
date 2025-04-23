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
      return existingUser;
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
            phoneNumber: '555-123-4567',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        }
      }
    });

    console.log(`Created test user with ID: ${user.id}`);
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    return null;
  }
}

async function createTutor(userId) {
  try {
    // Check if tutor already exists
    const existingTutor = await prisma.tutor.findFirst({
      where: { userId }
    });

    if (existingTutor) {
      console.log('Tutor profile already exists');
      return;
    }

    // Create tutor profile
    const tutor = await prisma.tutor.create({
      data: {
        specialization: 'Web Development',
        hourlyRate: 50,
        bio: 'Experienced web development instructor with 5+ years of teaching experience.',
        experience: 5,
        education: 'Master of Computer Science, Stanford University',
        location: 'New York, NY',
        userId
      }
    });

    console.log(`Created tutor profile with ID: ${tutor.id}`);
    return tutor;
  } catch (error) {
    console.error('Error creating tutor profile:', error);
    return null;
  }
}

// Run the script
main()
  .then(async (user) => {
    if (user) {
      await createTutor(user.id);
    }
  })
  .catch((e) => {
    console.error('Error in script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
