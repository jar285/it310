const { PrismaClient, Level } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed courses...');

  // First, check if we have tutors
  const tutorCount = await prisma.tutor.count();
  if (tutorCount === 0) {
    console.log('No tutors found. Please seed tutors first.');
    return;
  }

  // Get all tutors
  const tutors = await prisma.tutor.findMany();
  console.log(`Found ${tutors.length} tutors`);

  // Sample course categories
  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'Game Development',
    'UI/UX Design'
  ];

  // Sample course image URLs
  const courseImages = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503437313881-503a91226402?q=80&w=2032&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2071&auto=format&fit=crop',
  ];

  // Sample course data
  const coursesData = [
    {
      title: 'Complete JavaScript Masterclass',
      description: 'Master JavaScript from the basics to advanced concepts. Learn modern ES6+ features, asynchronous programming, and build real-world applications.',
      price: 79.99,
      duration: 1800, // 30 hours in minutes
      level: 'BEGINNER',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'React.js for Professionals',
      description: 'Take your React skills to the next level. Learn hooks, context API, Redux, and build complex applications with best practices.',
      price: 89.99,
      duration: 1200, // 20 hours in minutes
      level: 'INTERMEDIATE',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python programming with a focus on data analysis and visualization. Master libraries like Pandas, NumPy, and Matplotlib.',
      price: 69.99,
      duration: 1500, // 25 hours in minutes
      level: 'BEGINNER',
      category: 'Data Science',
      featured: false,
    },
    {
      title: 'Machine Learning with TensorFlow',
      description: 'Comprehensive guide to machine learning using TensorFlow. Build neural networks and deploy ML models in production.',
      price: 99.99,
      duration: 2100, // 35 hours in minutes
      level: 'ADVANCED',
      category: 'Machine Learning',
      featured: true,
    },
    {
      title: 'iOS App Development with Swift',
      description: 'Learn to build iOS applications using Swift. Master UIKit, SwiftUI, and publish your app to the App Store.',
      price: 84.99,
      duration: 1800, // 30 hours in minutes
      level: 'INTERMEDIATE',
      category: 'Mobile Development',
      featured: false,
    },
    {
      title: 'AWS Certified Solutions Architect',
      description: 'Prepare for the AWS Solutions Architect certification. Learn to design and deploy scalable systems on AWS.',
      price: 119.99,
      duration: 2400, // 40 hours in minutes
      level: 'ADVANCED',
      category: 'Cloud Computing',
      featured: true,
    },
    {
      title: 'Docker and Kubernetes Essentials',
      description: 'Master containerization with Docker and orchestration with Kubernetes. Deploy microservices at scale.',
      price: 94.99,
      duration: 1500, // 25 hours in minutes
      level: 'INTERMEDIATE',
      category: 'DevOps',
      featured: false,
    },
    {
      title: 'Ethical Hacking and Penetration Testing',
      description: 'Learn ethical hacking techniques to identify and fix security vulnerabilities in web applications and networks.',
      price: 109.99,
      duration: 1800, // 30 hours in minutes
      level: 'ADVANCED',
      category: 'Cybersecurity',
      featured: true,
    },
    {
      title: 'Blockchain Development with Ethereum',
      description: 'Build decentralized applications (DApps) on the Ethereum blockchain. Learn Solidity and Web3.js.',
      price: 89.99,
      duration: 1500, // 25 hours in minutes
      level: 'INTERMEDIATE',
      category: 'Blockchain',
      featured: false,
    },
    {
      title: 'UI/UX Design Principles',
      description: 'Master the fundamentals of user interface and user experience design. Create beautiful and functional designs using Figma.',
      price: 74.99,
      duration: 1200, // 20 hours in minutes
      level: 'BEGINNER',
      category: 'UI/UX Design',
      featured: true,
    },
    {
      title: 'Node.js Backend Development',
      description: 'Build scalable backend services with Node.js. Learn Express, MongoDB, and RESTful API design patterns.',
      price: 79.99,
      duration: 1500, // 25 hours in minutes
      level: 'INTERMEDIATE',
      category: 'Web Development',
      featured: false,
    },
    {
      title: 'Flutter Cross-Platform Development',
      description: 'Create beautiful native apps for iOS and Android from a single codebase using Flutter and Dart.',
      price: 84.99,
      duration: 1800, // 30 hours in minutes
      level: 'INTERMEDIATE',
      category: 'Mobile Development',
      featured: true,
    },
  ];

  // Create courses
  for (let i = 0; i < coursesData.length; i++) {
    const courseData = coursesData[i];
    // Assign a tutor randomly
    const tutor = tutors[Math.floor(Math.random() * tutors.length)];
    // Assign an image URL (cycling through the available ones)
    const imageUrl = courseImages[i % courseImages.length];

    await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        imageUrl: imageUrl,
        duration: courseData.duration,
        level: courseData.level,
        category: courseData.category,
        featured: courseData.featured,
        published: true,
        tutorId: tutor.id,
      },
    });

    console.log(`Created course: ${courseData.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
