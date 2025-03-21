'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  // Mock data for the dashboard
  const enrolledCourses = [
    {
      id: 'course-1',
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Smith',
      progress: 45,
      lastAccessed: '2 days ago',
      thumbnail: '/course-thumbnail-1.jpg',
    },
    {
      id: 'course-2',
      title: 'Advanced JavaScript: From Fundamentals to Functional JS',
      instructor: 'Sarah Johnson',
      progress: 78,
      lastAccessed: 'Yesterday',
      thumbnail: '/course-thumbnail-2.jpg',
    },
    {
      id: 'course-3',
      title: 'Data Science and Machine Learning with Python',
      instructor: 'Michael Chen',
      progress: 12,
      lastAccessed: '1 week ago',
      thumbnail: '/course-thumbnail-3.jpg',
    },
  ];

  const upcomingTutoringSessions = [
    {
      id: 'session-1',
      tutor: 'Professor Alex Johnson',
      subject: 'Mathematics',
      date: 'Tomorrow',
      time: '3:00 PM - 4:00 PM',
      status: 'confirmed',
    },
    {
      id: 'session-2',
      tutor: 'Dr. Emily Rodriguez',
      subject: 'Physics',
      date: 'Friday, May 12',
      time: '5:30 PM - 6:30 PM',
      status: 'pending',
    },
  ];

  const recommendedCourses = [
    {
      id: 'rec-course-1',
      title: 'Introduction to Artificial Intelligence',
      instructor: 'David Kim',
      rating: 4.8,
      ratingCount: 320,
      price: 8999,
      thumbnail: '/rec-course-1.jpg',
    },
    {
      id: 'rec-course-2',
      title: 'UX/UI Design Fundamentals',
      instructor: 'Lisa Wang',
      rating: 4.9,
      ratingCount: 450,
      price: 7999,
      thumbnail: '/rec-course-2.jpg',
    },
    {
      id: 'rec-course-3',
      title: 'Financial Markets and Investment Strategy',
      instructor: 'Robert Taylor',
      rating: 4.7,
      ratingCount: 280,
      price: 9999,
      thumbnail: '/rec-course-3.jpg',
    },
  ];

  const recentAchievements = [
    {
      id: 'achievement-1',
      title: 'Fast Learner',
      description: 'Completed 5 course modules in a single day',
      date: 'May 2, 2025',
      icon: '🚀',
    },
    {
      id: 'achievement-2',
      title: 'Perfect Score',
      description: 'Scored 100% on JavaScript Fundamentals quiz',
      date: 'April 28, 2025',
      icon: '🏆',
    },
    {
      id: 'achievement-3',
      title: 'Consistent Learner',
      description: 'Logged in for 7 consecutive days',
      date: 'April 25, 2025',
      icon: '🔥',
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Alex! Here's what's happening with your learning.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline">Browse Courses</Button>
              <Button>Find a Tutor</Button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-lg font-medium text-gray-900">Courses Enrolled</h2>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">3</p>
                    <p className="ml-2 text-sm text-gray-600">courses in progress</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-lg font-medium text-gray-900">Completed</h2>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">12</p>
                    <p className="ml-2 text-sm text-gray-600">lessons this week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-lg font-medium text-gray-900">Learning Time</h2>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">8.5</p>
                    <p className="ml-2 text-sm text-gray-600">hours this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Enrolled Courses */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                  <Link href="/dashboard/courses" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </div>
                <div className="space-y-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="flex flex-col sm:flex-row sm:items-center border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex-shrink-0 relative h-32 w-full sm:h-24 sm:w-40 bg-gray-200 rounded-lg mb-4 sm:mb-0 sm:mr-4">
                        {/* Course thumbnail placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-500">Thumbnail</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Link href={`/courses/${course.id}`} className="text-lg font-medium text-gray-900 hover:text-primary-600">
                          {course.title}
                        </Link>
                        <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-primary-600 h-2.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-700">{course.progress}%</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Last accessed: {course.lastAccessed}</p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-4">
                        <Button size="sm">Continue</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tutoring Sessions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Tutoring Sessions</h2>
                  <Link href="/dashboard/sessions" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </div>
                {upcomingTutoringSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTutoringSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{session.subject} with {session.tutor}</h3>
                            <p className="text-sm text-gray-600">{session.date} • {session.time}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              session.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                            <div className="ml-4">
                              <Button size="sm" variant={session.status === 'confirmed' ? 'primary' : 'outline'}>
                                {session.status === 'confirmed' ? 'Join Session' : 'Confirm'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking a session with a tutor.</p>
                    <div className="mt-6">
                      <Button>Find a Tutor</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Courses */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                  <Link href="/courses" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    Browse all courses
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg overflow-hidden">
                      <div className="relative h-36 bg-gray-200">
                        {/* Course thumbnail placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-500">Thumbnail</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(course.rating))}</span>
                          <span className="text-xs text-gray-600 ml-1">{course.rating} ({course.ratingCount})</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{formatPrice(course.price)}</span>
                          <Button size="sm" variant="outline">Add to Cart</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Profile Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                    <span className="text-xl text-primary-700 font-medium">AJ</span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Alex Johnson</h2>
                    <p className="text-sm text-gray-600">Student</p>
                  </div>
                </div>
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Profile completion</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">Complete Your Profile</Button>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-xl">
                        {achievement.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/achievements" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View all achievements
                  </Link>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Stats</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Weekly Goal</span>
                      <span className="text-sm font-medium text-gray-900">10 hours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">8.5 hours completed this week</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Current Streak</span>
                      <span className="text-sm font-medium text-gray-900">7 days</span>
                    </div>
                    <div className="flex justify-between">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                            index < 7 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Top Skills</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">JavaScript</span>
                          <span className="text-xs text-gray-600">Advanced</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Python</span>
                          <span className="text-xs text-gray-600">Intermediate</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Data Science</span>
                          <span className="text-xs text-gray-600">Beginner</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
