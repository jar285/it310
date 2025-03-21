export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number; // in cents
  instructorId: string;
  instructor: User;
  thumbnailUrl: string;
  categoryId: string;
  category: Category;
  rating: number;
  ratingCount: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  sections: CourseSection[];
}

export interface CourseSection {
  id: string;
  title: string;
  courseId: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // in seconds
  sectionId: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  courses: Course[];
}

export interface TutorProfile {
  id: string;
  userId: string;
  user: User;
  bio: string;
  hourlyRate: number; // in cents
  subjects: string[];
  education: string;
  experience: string;
  location: Location;
  availability: Availability[];
  reviews: Review[];
  averageRating: number;
}

export interface Location {
  id: string;
  tutorProfileId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface Availability {
  id: string;
  tutorProfileId: string;
  dayOfWeek: number; // 0-6, 0 is Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  tutorProfileId?: string;
  courseId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  studentId: string;
  student: User;
  tutorProfileId: string;
  tutorProfile: TutorProfile;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number; // in cents
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  user: User;
  courseId: string;
  course: Course;
  progress: number; // 0-100
  completedLessons: string[]; // lesson ids
  createdAt: Date;
  updatedAt: Date;
}
