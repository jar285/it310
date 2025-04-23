import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

// Define the Enrollment type since it's not yet in the generated Prisma client
type Enrollment = {
  id: string;
  enrollmentDate: Date;
  completionDate: Date | null;
  progress: number;
  lastAccessedAt: Date;
  status: string;
  orderId: string | null;
  userId: string;
  courseId: string;
};

export type EnrollmentWithCourse = Enrollment & {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    duration: number;
    level: string;
    tutor: {
      id: string;
      user: {
        name: string | null;
      };
    };
  };
};

export const enrollmentRepository = {
  findByUserId: async (userId: string): Promise<EnrollmentWithCourse[]> => {
    // Since the Enrollment model isn't generated yet, we'll use a raw query
    const enrollments = await prisma.$queryRaw`
      SELECT e.*, 
        c.id as "course.id", 
        c.title as "course.title", 
        c.description as "course.description", 
        c."imageUrl" as "course.imageUrl", 
        c.duration as "course.duration", 
        c.level as "course.level", 
        t.id as "course.tutor.id", 
        u.name as "course.tutor.user.name" 
      FROM "Enrollment" e 
      JOIN "Course" c ON e."courseId" = c.id 
      JOIN "Tutor" t ON c."tutorId" = t.id 
      JOIN "User" u ON t."userId" = u.id 
      WHERE e."userId" = ${userId} 
      ORDER BY e."enrollmentDate" DESC
    `;
    
    // Transform the raw results into the expected format
    return (enrollments as any[]).map(e => ({
      id: e.id,
      enrollmentDate: e.enrollmentDate,
      completionDate: e.completionDate,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt,
      status: e.status,
      orderId: e.orderId,
      userId: e.userId,
      courseId: e.courseId,
      course: {
        id: e["course.id"],
        title: e["course.title"],
        description: e["course.description"],
        imageUrl: e["course.imageUrl"],
        duration: e["course.duration"],
        level: e["course.level"],
        tutor: {
          id: e["course.tutor.id"],
          user: {
            name: e["course.tutor.user.name"]
          }
        }
      }
    }));
  },

  findById: async (id: string): Promise<EnrollmentWithCourse | null> => {
    const enrollment = await prisma.$queryRaw`
      SELECT e.*, 
        c.id as "course.id", 
        c.title as "course.title", 
        c.description as "course.description", 
        c."imageUrl" as "course.imageUrl", 
        c.duration as "course.duration", 
        c.level as "course.level", 
        t.id as "course.tutor.id", 
        u.name as "course.tutor.user.name" 
      FROM "Enrollment" e 
      JOIN "Course" c ON e."courseId" = c.id 
      JOIN "Tutor" t ON c."tutorId" = t.id 
      JOIN "User" u ON t."userId" = u.id 
      WHERE e.id = ${id}
    `;
    
    const results = enrollment as any[];
    if (results.length === 0) return null;
    
    const e = results[0];
    return {
      id: e.id,
      enrollmentDate: e.enrollmentDate,
      completionDate: e.completionDate,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt,
      status: e.status,
      orderId: e.orderId,
      userId: e.userId,
      courseId: e.courseId,
      course: {
        id: e["course.id"],
        title: e["course.title"],
        description: e["course.description"],
        imageUrl: e["course.imageUrl"],
        duration: e["course.duration"],
        level: e["course.level"],
        tutor: {
          id: e["course.tutor.id"],
          user: {
            name: e["course.tutor.user.name"]
          }
        }
      }
    };
  },

  findByUserAndCourse: async (userId: string, courseId: string): Promise<Enrollment | null> => {
    const enrollment = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" 
      WHERE "userId" = ${userId} AND "courseId" = ${courseId}
    `;
    
    const results = enrollment as any[];
    return results.length > 0 ? results[0] as Enrollment : null;
  },

  create: async (data: {
    userId: string;
    courseId: string;
    orderId?: string;
    status?: string;
  }): Promise<Enrollment> => {
    const result = await prisma.$executeRaw`
      INSERT INTO "Enrollment" ("id", "userId", "courseId", "orderId", "status", "progress", "enrollmentDate", "lastAccessedAt") 
      VALUES (gen_random_uuid(), ${data.userId}, ${data.courseId}, ${data.orderId || null}, ${data.status || 'active'}, 0, NOW(), NOW()) 
      RETURNING *
    `;
    
    // Fetch the created enrollment
    const enrollment = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" 
      WHERE "userId" = ${data.userId} AND "courseId" = ${data.courseId} 
      ORDER BY "enrollmentDate" DESC LIMIT 1
    `;
    
    return (enrollment as any[])[0] as Enrollment;
  },

  createMany: async (enrollments: Array<{
    userId: string;
    courseId: string;
    orderId?: string;
  }>): Promise<number> => {
    let count = 0;
    
    // Process each enrollment in a transaction
    await prisma.$transaction(async (tx) => {
      for (const enrollment of enrollments) {
        // Check if enrollment already exists
        const existing = await tx.$queryRaw`
          SELECT * FROM "Enrollment" 
          WHERE "userId" = ${enrollment.userId} AND "courseId" = ${enrollment.courseId}
        `;
        
        // Only create if it doesn't exist
        if ((existing as any[]).length === 0) {
          await tx.$executeRaw`
            INSERT INTO "Enrollment" ("id", "userId", "courseId", "orderId", "status", "progress", "enrollmentDate", "lastAccessedAt") 
            VALUES (gen_random_uuid(), ${enrollment.userId}, ${enrollment.courseId}, ${enrollment.orderId || null}, 'active', 0, NOW(), NOW())
          `;
          count++;
        }
      }
    });

    return count;
  },

  updateProgress: async (id: string, progress: number): Promise<Enrollment> => {
    const status = progress >= 100 ? 'completed' : 'active';
    const completionDate = progress >= 100 ? 'NOW()' : null;
    
    await prisma.$executeRaw`
      UPDATE "Enrollment" 
      SET "progress" = ${progress}, 
          "lastAccessedAt" = NOW(), 
          "status" = ${status}, 
          "completionDate" = ${completionDate ? Prisma.raw(completionDate) : null} 
      WHERE "id" = ${id}
    `;
    
    const enrollment = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" WHERE "id" = ${id}
    `;
    
    return (enrollment as any[])[0] as Enrollment;
  },

  updateStatus: async (id: string, status: string): Promise<Enrollment> => {
    const completionDate = status === 'completed' ? 'NOW()' : null;
    
    await prisma.$executeRaw`
      UPDATE "Enrollment" 
      SET "status" = ${status}, 
          "completionDate" = ${completionDate ? Prisma.raw(completionDate) : null} 
      WHERE "id" = ${id}
    `;
    
    const enrollment = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" WHERE "id" = ${id}
    `;
    
    return (enrollment as any[])[0] as Enrollment;
  },

  delete: async (id: string): Promise<Enrollment> => {
    // Get the enrollment before deleting
    const enrollment = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" WHERE "id" = ${id}
    `;
    
    await prisma.$executeRaw`
      DELETE FROM "Enrollment" WHERE "id" = ${id}
    `;
    
    return (enrollment as any[])[0] as Enrollment;
  },

  getStats: async (userId: string): Promise<{
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
    averageProgress: number;
  }> => {
    const enrollments = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" WHERE "userId" = ${userId}
    `;
    
    const enrollmentArray = enrollments as any[];
    const totalEnrollments = enrollmentArray.length;
    const completedCourses = enrollmentArray.filter(e => e.status === 'completed').length;
    const inProgressCourses = enrollmentArray.filter(e => e.status === 'active').length;
    const averageProgress = totalEnrollments > 0
      ? enrollmentArray.reduce((sum: number, e: any) => sum + e.progress, 0) / totalEnrollments
      : 0;

    return {
      totalEnrollments,
      completedCourses,
      inProgressCourses,
      averageProgress,
    };
  },
};
