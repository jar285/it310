const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Start PostgreSQL container
console.log('Starting PostgreSQL container...');
try {
  // Check if container already exists
  const containerCheck = execSync('docker ps -a --filter "name=tutor-trend-db" --format "{{.Names}}"').toString().trim();
  
  if (containerCheck === 'tutor-trend-db') {
    // Container exists, check if it's running
    const containerStatus = execSync('docker ps --filter "name=tutor-trend-db" --format "{{.Names}}"').toString().trim();
    
    if (containerStatus !== 'tutor-trend-db') {
      console.log('Starting existing container...');
      execSync('docker start tutor-trend-db');
    } else {
      console.log('Container is already running');
    }
  } else {
    // Create and start new container
    console.log('Creating new PostgreSQL container...');
    execSync('docker run --name tutor-trend-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=tutortrend -p 5432:5432 -d postgres:latest');
    
    // Wait for PostgreSQL to start
    console.log('Waiting for PostgreSQL to start...');
    execSync('sleep 5');
  }
} catch (error) {
  console.error('Error setting up Docker container:', error.message);
  process.exit(1);
}

// Run database migrations
console.log('Running database migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running migrations:', error.message);
  process.exit(1);
}

// Create test user
async function createTestUser() {
  console.log('Creating test user...');
  
  const prisma = new PrismaClient();
  
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
    
    // Create a tutor profile for testing
    const tutor = await prisma.tutor.create({
      data: {
        specialization: 'Web Development',
        hourlyRate: 50,
        bio: 'Experienced web development instructor with 5+ years of teaching experience.',
        experience: 5,
        education: 'Master of Computer Science, Stanford University',
        location: 'New York, NY',
        userId: user.id
      }
    });
    
    console.log(`Created tutor profile with ID: ${tutor.id}`);
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
