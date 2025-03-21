'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  // In a real application, you would fetch the course data based on the ID
  // This is just mock data for demonstration purposes
  const course = {
    id: params.id,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn web development from scratch with this comprehensive bootcamp. You will master HTML, CSS, JavaScript, React, Node.js, and more.',
    longDescription: `
      This comprehensive web development course is designed to take you from beginner to professional developer. 
      
      You'll start with the fundamentals of HTML, CSS, and JavaScript, then progress to advanced topics like React, Node.js, Express, and MongoDB. By the end of this course, you'll have built several real-world projects for your portfolio and gained the skills needed to land your first web development job.
      
      What you'll learn:
      - HTML5 and CSS3 fundamentals
      - JavaScript programming (ES6+)
      - Frontend development with React
      - Backend development with Node.js and Express
      - Database design with MongoDB
      - Authentication and authorization
      - Deployment and hosting
      - Best practices and performance optimization
    `,
    price: 9999, // $99.99
    instructor: {
      name: 'John Smith',
      bio: 'Senior Web Developer with 10+ years of experience. John has worked with companies like Google, Facebook, and Amazon.',
      avatar: '/instructor-avatar.jpg',
    },
    category: 'Web Development',
    level: 'Beginner to Advanced',
    duration: '40 hours',
    lectures: 120,
    rating: 4.8,
    ratingCount: 450,
    students: 12500,
    lastUpdated: 'March 2025',
    language: 'English',
    features: [
      'Lifetime access',
      'Access on mobile and TV',
      'Certificate of completion',
      'Downloadable resources',
      '30-day money-back guarantee',
    ],
    curriculum: [
      {
        title: 'Introduction to Web Development',
        lectures: 5,
        duration: '2 hours',
      },
      {
        title: 'HTML Fundamentals',
        lectures: 10,
        duration: '4 hours',
      },
      {
        title: 'CSS Styling and Layout',
        lectures: 15,
        duration: '6 hours',
      },
      {
        title: 'JavaScript Basics',
        lectures: 20,
        duration: '8 hours',
      },
      {
        title: 'Advanced JavaScript',
        lectures: 15,
        duration: '6 hours',
      },
      {
        title: 'React Fundamentals',
        lectures: 20,
        duration: '8 hours',
      },
      {
        title: 'Backend Development with Node.js',
        lectures: 15,
        duration: '6 hours',
      },
    ],
    reviews: [
      {
        id: 'review-1',
        user: 'Sarah Johnson',
        rating: 5,
        date: 'February 15, 2025',
        comment: 'This course exceeded my expectations! I went from knowing nothing about web development to building my own full-stack applications. The instructor explains concepts clearly and the projects are engaging.',
      },
      {
        id: 'review-2',
        user: 'Michael Chen',
        rating: 5,
        date: 'January 28, 2025',
        comment: 'Excellent course with comprehensive content. I especially appreciated the sections on React and Node.js. The instructor is knowledgeable and responds quickly to questions.',
      },
      {
        id: 'review-3',
        user: 'Emily Rodriguez',
        rating: 4,
        date: 'December 10, 2024',
        comment: 'Great course overall. Some sections could use more detailed explanations, but the projects are well-designed and practical.',
      },
    ],
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Course Header */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">{'★'.repeat(Math.floor(course.rating))}{course.rating % 1 >= 0.5 ? '★' : '☆'}{'☆'.repeat(5 - Math.ceil(course.rating))}</span>
                    <span className="text-sm text-gray-600 ml-1">{course.rating} ({course.ratingCount} ratings)</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{course.students.toLocaleString()} students</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">Last updated {course.lastUpdated}</span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                      <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">{course.instructor.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Created by {course.instructor.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-sm text-gray-600">{course.lectures} lectures</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="text-sm text-gray-600">{course.language}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">{course.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="relative h-48 bg-gray-200">
                    {/* Course thumbnail placeholder */}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">${(course.price / 100).toFixed(2)}</span>
                    </div>
                    <Button className="w-full mb-4">Enroll Now</Button>
                    <Button variant="outline" className="w-full mb-6">Add to Cart</Button>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p className="mb-2">This course includes:</p>
                      <ul className="space-y-2">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Share
                      </button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Gift this course
                      </button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Apply Coupon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <div className="whitespace-pre-line text-gray-700">
                  {course.longDescription}
                </div>
              </div>
              
              {/* Course Content */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">{course.curriculum.length} sections • {course.lectures} lectures • {course.duration} total</span>
                </div>
                
                <div className="space-y-2">
                  {course.curriculum.map((section, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer">
                        <div>
                          <h3 className="font-medium text-gray-900">Section {index + 1}: {section.title}</h3>
                          <p className="text-sm text-gray-600">{section.lectures} lectures • {section.duration}</p>
                        </div>
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Instructor */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
                <div className="flex items-start">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                    <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                      <span className="text-xl text-primary-700 font-medium">{course.instructor.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{course.instructor.name}</h3>
                    <p className="text-gray-600 mt-1">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl mr-2">{'★'.repeat(Math.floor(course.rating))}{course.rating % 1 >= 0.5 ? '★' : '☆'}{'☆'.repeat(5 - Math.ceil(course.rating))}</span>
                    <span className="text-lg font-medium text-gray-900">{course.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({course.ratingCount} ratings)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{review.user.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{review.user}</h4>
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            <span className="text-sm text-gray-600 ml-1">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">See All Reviews</Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Related Courses */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Courses</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="relative h-16 w-24 bg-gray-200 rounded mr-3 flex-shrink-0">
                        {/* Course thumbnail placeholder */}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">Related Course Title {item}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-xs">★★★★★</span>
                          <span className="text-xs text-gray-600 ml-1">5.0</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">$49.99</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Browse more courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
