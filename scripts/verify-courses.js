const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCourses() {
  console.log('Verifying and updating courses...');
  
  try {
    // Get all courses
    const courses = await prisma.course.findMany();
    console.log(`Found ${courses.length} courses in the database`);
    
    if (courses.length === 0) {
      console.log('No courses found. Please run the seed-courses.ts script first.');
      return;
    }
    
    // Get all tutors
    const tutors = await prisma.tutor.findMany();
    console.log(`Found ${tutors.length} tutors in the database`);
    
    if (tutors.length === 0) {
      console.log('No tutors found. Please run the create-sample-tutors.js script first.');
      return;
    }
    
    // Check and update each course
    let updatedCount = 0;
    for (const course of courses) {
      let needsUpdate = false;
      const updates = {};
      
      // Check if the course is published
      if (!course.published) {
        updates.published = true;
        needsUpdate = true;
        console.log(`Course ${course.title} is not published, updating...`);
      }
      
      // Check if the tutor exists
      const tutorExists = tutors.some(tutor => tutor.id === course.tutorId);
      if (!tutorExists) {
        // Assign to a random tutor
        const randomTutor = tutors[Math.floor(Math.random() * tutors.length)];
        updates.tutorId = randomTutor.id;
        needsUpdate = true;
        console.log(`Course ${course.title} has invalid tutor, reassigning to ${randomTutor.id}...`);
      }
      
      // Update the course if needed
      if (needsUpdate) {
        await prisma.course.update({
          where: { id: course.id },
          data: updates
        });
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} courses`);
    console.log('Verification complete');
    
  } catch (error) {
    console.error('Error verifying courses:', error);
  }
}

// Run the script
verifyCourses()
  .catch((e) => {
    console.error('Error in script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
