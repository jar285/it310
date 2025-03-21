'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';

interface TutorProfilePageProps {
  params: {
    id: string;
  };
}

export default function TutorProfilePage({ params }: TutorProfilePageProps) {
  // In a real application, you would fetch the tutor data based on the ID
  // This is just mock data for demonstration purposes
  const tutor = {
    id: params.id,
    name: 'Professor Alex Johnson',
    title: 'Mathematics & Computer Science Tutor',
    bio: `I'm a passionate educator with over 10 years of experience teaching mathematics and computer science. I hold a Ph.D. in Applied Mathematics from MIT and have taught at various universities before becoming a full-time tutor.

I believe in making complex concepts accessible to students of all levels. My teaching approach focuses on building a strong foundation of fundamentals and then gradually introducing more advanced topics. I'm patient, detail-oriented, and committed to helping my students achieve their academic goals.`,
    subjects: ['Mathematics', 'Calculus', 'Linear Algebra', 'Computer Science', 'Python Programming'],
    education: [
      {
        degree: 'Ph.D. in Applied Mathematics',
        institution: 'Massachusetts Institute of Technology',
        year: '2015',
      },
      {
        degree: 'M.S. in Computer Science',
        institution: 'Stanford University',
        year: '2012',
      },
      {
        degree: 'B.S. in Mathematics',
        institution: 'University of California, Berkeley',
        year: '2010',
      },
    ],
    experience: [
      {
        position: 'Adjunct Professor',
        institution: 'Boston University',
        period: '2015-2020',
        description: 'Taught undergraduate and graduate courses in mathematics and computer science.',
      },
      {
        position: 'Research Assistant',
        institution: 'MIT Applied Mathematics Lab',
        period: '2012-2015',
        description: 'Conducted research in computational mathematics and algorithm optimization.',
      },
    ],
    location: 'Boston, Massachusetts',
    rate: 75, // $75/hour
    availability: {
      weekdays: true,
      evenings: true,
      weekends: true,
    },
    rating: 4.9,
    ratingCount: 120,
    studentCount: 250,
    languages: ['English', 'Spanish'],
    teachingStyle: [
      'Conceptual understanding over memorization',
      'Practical examples and real-world applications',
      'Interactive problem-solving sessions',
      'Customized learning plans for each student',
    ],
    reviews: [
      {
        id: 'review-1',
        student: 'Michael Chen',
        rating: 5,
        date: 'February 20, 2025',
        comment: "Professor Johnson helped me understand calculus concepts that I had been struggling with for months. His explanations are clear and he's very patient. Highly recommend!",
      },
      {
        id: 'review-2',
        student: 'Emily Rodriguez',
        rating: 5,
        date: 'January 15, 2025',
        comment: 'I was failing my linear algebra class before I started working with Alex. After just a few sessions, I was able to raise my grade to an A-. He has a gift for making complex topics understandable.',
      },
      {
        id: 'review-3',
        student: 'David Kim',
        rating: 4,
        date: 'December 5, 2024',
        comment: 'Great tutor who really knows his stuff. Sometimes moves a bit quickly through material, but always willing to slow down when asked. Helped me prepare for my CS exams effectively.',
      },
    ],
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Tutor Header */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden mr-6 bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl text-primary-700 font-medium">{tutor.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{tutor.name}</h1>
                    <p className="text-lg text-gray-600 mb-3">{tutor.title}</p>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">{'★'.repeat(Math.floor(tutor.rating))}{tutor.rating % 1 >= 0.5 ? '★' : '☆'}{'☆'.repeat(5 - Math.ceil(tutor.rating))}</span>
                        <span className="text-sm text-gray-600 ml-1">{tutor.rating} ({tutor.ratingCount} reviews)</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{tutor.studentCount} students</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutor.subjects.map((subject, index) => (
                        <span key={index} className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {tutor.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border p-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">${tutor.rate}</span>
                    <span className="text-gray-600">/hour</span>
                  </div>
                  
                  <Button className="w-full mb-4">Book a Session</Button>
                  <Button variant="outline" className="w-full mb-6">Message Tutor</Button>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className={`text-center p-2 rounded ${tutor.availability.weekdays ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                        Weekdays
                      </div>
                      <div className={`text-center p-2 rounded ${tutor.availability.evenings ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                        Evenings
                      </div>
                      <div className={`text-center p-2 rounded ${tutor.availability.weekends ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                        Weekends
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.languages.map((language, index) => (
                        <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tutor Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* About */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {tutor.bio}
                </div>
              </div>
              
              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {tutor.education.map((edu, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Experience */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
                <div className="space-y-6">
                  {tutor.experience.map((exp, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.institution}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Teaching Style */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Teaching Style</h2>
                <ul className="space-y-2">
                  {tutor.teachingStyle.map((style, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{style}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl mr-2">{'★'.repeat(Math.floor(tutor.rating))}{tutor.rating % 1 >= 0.5 ? '★' : '☆'}{'☆'.repeat(5 - Math.ceil(tutor.rating))}</span>
                    <span className="text-lg font-medium text-gray-900">{tutor.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({tutor.ratingCount} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {tutor.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{review.student.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{review.student}</h4>
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
              {/* Calendar Placeholder */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule a Session</h2>
                <div className="bg-gray-100 rounded-lg p-4 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-500">Calendar widget would be displayed here</p>
                </div>
                <Button className="w-full mt-4">Check Availability</Button>
              </div>
              
              {/* Similar Tutors */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Tutors</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">T{item}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">Tutor Name {item}</h3>
                        <p className="text-xs text-gray-600">Mathematics, Physics</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-xs">★★★★★</span>
                          <span className="text-xs text-gray-600 ml-1">5.0</span>
                          <span className="text-xs text-gray-600 ml-2">${50 + (item * 5)}/hr</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/tutors" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Browse more tutors
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
