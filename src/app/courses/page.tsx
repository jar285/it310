'use client'
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function CoursesPage() {
  // This would be fetched from an API in a real application
  const categories = [
    'Web Development',
    'Data Science',
    'Business',
    'Design',
    'Marketing',
    'Photography',
    'Music',
    'Health & Fitness',
    'Language Learning',
    'Personal Development',
  ];

  // This would be fetched from an API in a real application
  const courses = Array.from({ length: 12 }, (_, i) => ({
    id: `course-${i + 1}`,
    title: `Course Title ${i + 1}`,
    description: 'This is a sample course description that would explain what the course covers and what students will learn.',
    price: Math.floor(Math.random() * 10000) + 1000, // Random price between $10-$100
    instructorName: 'Instructor Name',
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
    ratingCount: Math.floor(Math.random() * 1000) + 50,
  }));

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="mt-1 text-lg text-gray-600">Browse our catalog of courses</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative rounded-md shadow-sm max-w-xs">
                <Input type="text" placeholder="Search courses..." className="pr-10" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Filters */}
            <div className="hidden md:block">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900">Categories</h2>
                <div className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        name={`category-${category}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Price Range</h2>
                  <div className="mt-4 space-y-2">
                    {['Free', 'Under $20', '$20 - $50', '$50 - $100', 'Over $100'].map((price) => (
                      <div key={price} className="flex items-center">
                        <input
                          id={`price-${price}`}
                          name={`price-${price}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`price-${price}`} className="ml-3 text-sm text-gray-600">
                          {price}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Rating</h2>
                  <div className="mt-4 space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          id={`rating-${rating}`}
                          name={`rating-${rating}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`rating-${rating}`} className="ml-3 flex items-center text-sm text-gray-600">
                          <span className="text-yellow-400 mr-1">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                          <span>& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Button variant="outline" className="w-full">Apply Filters</Button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div key={course.id} className="flex flex-col rounded-lg bg-white shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1">
                    <div className="relative h-48 bg-gray-200">
                      {/* Course thumbnail placeholder */}
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                          {course.category}
                        </span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">{`${'★'.repeat(Math.floor(Number(course.rating)))}${Number(course.rating) % 1 >= 0.5 ? '★' : '☆'}${'☆'.repeat(5 - Math.ceil(Number(course.rating)))}`}</span>
                          <span className="text-xs text-gray-500 ml-1">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-bold text-gray-900">${(course.price / 100).toFixed(2)}</span>
                        <Link href={`/courses/${course.id}`}>
                          <Button size="sm">View Course</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
