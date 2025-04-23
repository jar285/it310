const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Sample tutor data with diverse specializations
const tutorData = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    specialization: 'Mathematics',
    hourlyRate: 65,
    bio: 'Mathematics professor with over 15 years of teaching experience. Specializes in calculus, linear algebra, and statistics.',
    experience: 15,
    education: 'Ph.D. in Mathematics, MIT',
    location: 'Boston, MA'
  },
  {
    name: 'Prof. Michael Chen',
    email: 'michael.chen@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    specialization: 'Computer Science',
    hourlyRate: 75,
    bio: 'Computer Science professor specializing in algorithms, data structures, and machine learning. Former software engineer at Google.',
    experience: 12,
    education: 'Ph.D. in Computer Science, Stanford University',
    location: 'San Francisco, CA'
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    specialization: 'Foreign Languages',
    hourlyRate: 55,
    bio: 'Multilingual language instructor fluent in Spanish, French, and Italian. Specializes in conversational language learning and cultural immersion.',
    experience: 8,
    education: 'M.A. in Linguistics, NYU',
    location: 'New York, NY'
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    specialization: 'Physics',
    hourlyRate: 70,
    bio: 'Physics professor with expertise in quantum mechanics and theoretical physics. Published researcher with multiple papers in top journals.',
    experience: 18,
    education: 'Ph.D. in Physics, Caltech',
    location: 'Pasadena, CA'
  },
  {
    name: 'Olivia Kim',
    email: 'olivia.kim@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    specialization: 'Music',
    hourlyRate: 60,
    bio: 'Classically trained pianist and music theory instructor. Graduate of Juilliard School of Music with performance experience at Carnegie Hall.',
    experience: 10,
    education: 'M.M. in Piano Performance, Juilliard',
    location: 'New York, NY'
  },
  {
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    specialization: 'History',
    hourlyRate: 50,
    bio: 'History professor specializing in American and European history. Published author of multiple history books and documentaries.',
    experience: 14,
    education: 'Ph.D. in History, Columbia University',
    location: 'Chicago, IL'
  },
  {
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    specialization: 'Chemistry',
    hourlyRate: 65,
    bio: 'Chemistry professor with expertise in organic chemistry and biochemistry. Former research scientist at pharmaceutical companies.',
    experience: 11,
    education: 'Ph.D. in Chemistry, UC Berkeley',
    location: 'Berkeley, CA'
  },
  {
    name: 'Robert Garcia',
    email: 'robert.garcia@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    specialization: 'Art',
    hourlyRate: 55,
    bio: 'Professional artist and art instructor with expertise in various mediums including oil painting, watercolor, and digital art.',
    experience: 9,
    education: 'M.F.A. in Fine Arts, Rhode Island School of Design',
    location: 'Providence, RI'
  }
];

async function createTutors() {
  console.log('Creating sample tutors...');
  
  for (const tutor of tutorData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: tutor.email }
      });
      
      if (existingUser) {
        console.log(`User with email ${tutor.email} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(tutor.password, 10);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          name: tutor.name,
          email: tutor.email,
          password: hashedPassword,
          image: tutor.image,
          profile: {
            create: {
              bio: tutor.bio,
              phoneNumber: '555-' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
              address: Math.floor(100 + Math.random() * 9900) + ' Main St',
              city: tutor.location.split(', ')[0],
              state: tutor.location.split(', ')[1],
              zipCode: String(Math.floor(10000 + Math.random() * 90000)),
              country: 'USA'
            }
          }
        }
      });
      
      // Create tutor profile
      const tutorProfile = await prisma.tutor.create({
        data: {
          specialization: tutor.specialization,
          hourlyRate: tutor.hourlyRate,
          bio: tutor.bio,
          experience: tutor.experience,
          education: tutor.education,
          location: tutor.location,
          userId: user.id
        }
      });
      
      console.log(`Created tutor: ${tutor.name} with ID: ${tutorProfile.id}`);
    } catch (error) {
      console.error(`Error creating tutor ${tutor.name}:`, error);
    }
  }
  
  console.log('Finished creating sample tutors');
}

// Run the script
createTutors()
  .catch((e) => {
    console.error('Error in script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
