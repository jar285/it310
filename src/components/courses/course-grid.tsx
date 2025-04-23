'use client';

import { Course } from '@prisma/client';
import CourseCard from './course-card';

interface CourseGridProps {
  courses: (Course & {
    tutor?: {
      id: string;
      name: string;
    };
    _count?: {
      reviews: number;
    };
    averageRating?: number;
  })[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div>
          <p className="text-lg font-medium text-gray-500">No courses found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
