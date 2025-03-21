'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";

export default function Home() {
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button size="lg">Explore Courses</Button>
                </Link>
                <Link href="/tutors">
                  <Button variant="outline" size="lg">Find a Tutor</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/hero-image.jpg" 
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
            {/* Course cards would go here - using placeholders for now */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-48 bg-gray-200">
                  {/* Course thumbnail placeholder */}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Category</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-xs text-gray-500 ml-1">5.0</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Course Title</h3>
                  <p className="text-sm text-gray-600 mb-4">Brief description of the course content and what students will learn.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">$49.99</span>
                    <Button size="sm">View Course</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/courses">
              <Button variant="outline">View All Courses</Button>
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
            {[
              {
                title: 'Choose Your Path',
                description: 'Browse our catalog of online courses or search for local tutors based on your learning needs.',
                icon: '🔍'
              },
              {
                title: 'Learn Your Way',
                description: 'Study at your own pace with online courses or schedule sessions with your matched tutor.',
                icon: '📚'
              },
              {
                title: 'Achieve Your Goals',
                description: 'Track your progress, earn certificates, and reach your educational objectives.',
                icon: '🏆'
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-white">Ready to Start Learning?</h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of students who are already expanding their knowledge and skills with TutorTrend.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">Sign Up Now</Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary-700">Browse Courses</Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
