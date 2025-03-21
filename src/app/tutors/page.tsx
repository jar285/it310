'use client'
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function TutorsPage() {
  // This would be fetched from an API in a real application
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography',
    'Foreign Languages',
    'Music',
    'Art',
  ];

  // This would be fetched from an API in a real application
  const tutors = Array.from({ length: 12 }, (_, i) => ({
    id: `tutor-${i + 1}`,
    name: `Tutor Name ${i + 1}`,
    subjects: [
      subjects[Math.floor(Math.random() * subjects.length)],
      subjects[Math.floor(Math.random() * subjects.length)],
    ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
    location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    rate: Math.floor(Math.random() * 50) + 20, // Random rate between $20-$70
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
    ratingCount: Math.floor(Math.random() * 100) + 5,
    experience: Math.floor(Math.random() * 15) + 1, // 1-15 years
    bio: 'Experienced tutor with a passion for teaching and helping students achieve their academic goals.',
    availability: ['Weekdays', 'Evenings', 'Weekends'][Math.floor(Math.random() * 3)],
  }));

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find a Tutor</h1>
              <p className="mt-1 text-lg text-gray-600">Connect with experienced tutors in your area</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative rounded-md shadow-sm max-w-xs">
                <Input type="text" placeholder="Search tutors..." className="pr-10" />
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
                <h2 className="text-lg font-medium text-gray-900">Location</h2>
                <div className="mt-4">
                  <Input type="text" placeholder="Enter your location" />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Virtual sessions only</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Subjects</h2>
                  <div className="mt-4 space-y-2">
                    {subjects.slice(0, 6).map((subject) => (
                      <div key={subject} className="flex items-center">
                        <input
                          id={`subject-${subject}`}
                          name={`subject-${subject}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`subject-${subject}`} className="ml-3 text-sm text-gray-600">
                          {subject}
                        </label>
                      </div>
                    ))}
                    <div className="pt-2">
                      <button className="text-sm text-primary-600 hover:text-primary-500">
                        Show more
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Hourly Rate</h2>
                  <div className="mt-4 space-y-2">
                    {['Under $25', '$25 - $50', '$50 - $75', 'Over $75'].map((rate) => (
                      <div key={rate} className="flex items-center">
                        <input
                          id={`rate-${rate}`}
                          name={`rate-${rate}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`rate-${rate}`} className="ml-3 text-sm text-gray-600">
                          {rate}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Availability</h2>
                  <div className="mt-4 space-y-2">
                    {['Weekdays', 'Evenings', 'Weekends'].map((time) => (
                      <div key={time} className="flex items-center">
                        <input
                          id={`time-${time}`}
                          name={`time-${time}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`time-${time}`} className="ml-3 text-sm text-gray-600">
                          {time}
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

            {/* Tutors Grid */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tutors.map((tutor) => (
                  <div key={tutor.id} className="flex flex-col rounded-lg bg-white shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1">
                    <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                      {/* Tutor avatar placeholder */}
                      <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary-600">{tutor.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          {tutor.location}
                        </span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">{`${'★'.repeat(Math.floor(Number(tutor.rating)))}${Number(tutor.rating) % 1 >= 0.5 ? '★' : '☆'}${'☆'.repeat(5 - Math.ceil(Number(tutor.rating)))}`}</span>
                          <span className="text-xs text-gray-500 ml-1">{tutor.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name}</h3>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {tutor.subjects.map((subject) => (
                          <span key={subject} className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 flex-grow">{tutor.bio}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-bold text-gray-900">${tutor.rate}/hr</span>
                        <Link href={`/tutors/${tutor.id}`}>
                          <Button size="sm">View Profile</Button>
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
