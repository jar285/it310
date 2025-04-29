'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";

export default function Home() {
  // Place your own course images in public/images and reference here
  const placeholderCourses = [
    { id: 1, imageUrl: '/react-basics.jpg', category: 'Web Development', rating: 4.5, title: 'Mastering React Basics', description: 'Build dynamic UIs and components using React.js.', price: 49.99 },
    { id: 2, imageUrl: '/python-data-science.jpg', category: 'Data Science', rating: 4.7, title: 'Python for Data Science', description: 'Analyze and visualize data with Python.', price: 59.99 },
    { id: 3, imageUrl: '/ux-design.jpg', category: 'UI/UX Design', rating: 4.6, title: 'Fundamentals of UI/UX Design', description: 'Learn user-centered design and prototyping techniques.', price: 39.99 },
  ];

  // Place your own step icons in public/images and reference here
  const steps = [
    { title: 'Choose Your Path', description: 'Browse our catalog of online courses or search for local tutors based on your learning needs.', iconUrl: '/choose-path.png' },
    { title: 'Learn Your Way', description: 'Study at your own pace with online courses or schedule sessions with your matched tutor.', iconUrl: '/learn-your-way.png' },
    { title: 'Achieve Your Goals', description: 'Track your progress, earn certificates, and reach your educational objectives.', iconUrl: '/achieve-goals.png' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold font-heading text-gray-900 leading-tight">
                Learn from the Best <span className="text-primary-600">Anytime, Anywhere</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-lg">
                TutorTrend combines premium online courses with personalized local tutoring to give you the best learning experience.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="hover:bg-gray-100 cursor-pointer">Explore Courses</Button>
                </Link>
                <Link href="/tutors">
                  <Button variant="outline" size="lg" className="hover:bg-gray-100 cursor-pointer">Find a Tutor</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/hero-image.png" 
                alt="Students learning online" 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading text-gray-900">Featured Courses</h2>
            <p className="mt-2 text-lg text-gray-600">Expand your knowledge with our top-rated courses</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{course.category}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">${course.price.toFixed(2)}</span>
                    <Button size="sm">View Course</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/courses">
              <Button variant="outline" className="hover:bg-gray-100 cursor-pointer">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tutor Matching Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/tutor-image.jpg" 
                  alt="Tutor helping student" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold font-heading text-gray-900">Find Your Perfect Tutor</h2>
              <p className="mt-4 text-lg text-gray-600">
                Connect with experienced tutors in your area for personalized, one-on-one learning sessions.
              </p>
              <ul className="mt-6 space-y-4">
                {['Verified professional tutors', 'Flexible scheduling', 'In-person or virtual sessions', 'Affordable rates'].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/tutors">
                  <Button>Find a Tutor Near You</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900">How TutorTrend Works</h2>
            <p className="mt-2 text-lg text-gray-600">Simple steps to start your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                <Image src={step.iconUrl} alt={step.title} width={48} height={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900">What Our Students Say</h2>
            <p className="mt-2 text-lg text-gray-600">Success stories from the TutorTrend community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Web Development Student',
                quote: 'The combination of self-paced courses and weekly tutor sessions helped me land my dream job as a frontend developer.',
                avatar: '/testimonial-1.jpg'
              },
              {
                name: 'Sarah Williams',
                role: 'Math Student',
                quote: 'My tutor made complex calculus concepts easy to understand. My grades improved dramatically after just a few sessions.',
                avatar: '/testimonial-2.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'Language Learner',
                quote: 'Learning Spanish through TutorTrend was incredibly effective. The courses provided structure while my tutor helped with conversation practice.',
                avatar: '/testimonial-3.jpg'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    {/* Avatar placeholder */}
                    <div className="absolute inset-0 bg-primary-200 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-black">
            Ready to Start Learning?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Join thousands of students who are already expanding their knowledge and skills with TutorTrend.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-gray-100 cursor-pointer">
                Sign Up – It’s Free!
              </Button>
            </Link>

            <Link href="/courses" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-gray-100 cursor-pointer">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}