'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former education consultant with 15+ years of experience in EdTech. Sarah founded TutorTrend with a vision to make quality education accessible to everyone.',
      image: '/team-member-1.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech industry veteran with a background in AI and machine learning. Michael leads our engineering team and is passionate about using technology to improve educational outcomes.',
      image: '/team-member-2.jpg',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Education',
      bio: 'Former university professor with a PhD in Education. Emily ensures that our platform maintains the highest standards of educational quality and effectiveness.',
      image: '/team-member-3.jpg',
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      bio: 'Product management expert with experience at leading tech companies. David focuses on creating intuitive and engaging learning experiences for our users.',
      image: '/team-member-4.jpg',
    },
  ];

  const values = [
    {
      title: 'Accessible Education',
      description: 'We believe that quality education should be accessible to everyone, regardless of location or background.',
      icon: (
        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      title: 'Personalized Learning',
      description: 'We recognize that every learner is unique, with different needs, goals, and learning styles.',
      icon: (
        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: 'Quality Content',
      description: 'We maintain rigorous standards for our courses and tutors, ensuring that learners receive the highest quality education.',
      icon: (
        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Continuous Innovation',
      description: 'We constantly explore new technologies and teaching methodologies to improve the learning experience.',
      icon: (
        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { label: 'Students', value: '100,000+' },
    { label: 'Courses', value: '2,500+' },
    { label: 'Tutors', value: '1,200+' },
    { label: 'Countries', value: '150+' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About <span className="text-primary-600">TutorTrend</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              We're on a mission to transform education by connecting learners with the best courses and tutors worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="mt-6 text-lg text-gray-600 space-y-4">
                <p>
                  TutorTrend was founded in 2023 with a simple yet powerful vision: to make quality education accessible to everyone, everywhere. We recognized that while there were many online learning platforms, few effectively combined the benefits of self-paced courses with personalized tutoring.
                </p>
                <p>
                  Our founder, Sarah Johnson, experienced this gap firsthand as both an educator and a lifelong learner. She envisioned a platform where learners could not only access top-quality courses but also connect with expert tutors who could provide personalized guidance and support.
                </p>
                <p>
                  What started as a small team of passionate educators and technologists has grown into a global community of learners, instructors, and tutors united by a common goal: to transform education and empower individuals to achieve their full potential.
                </p>
              </div>
            </div>
            <div className="relative h-96 bg-gray-200 rounded-lg">
              {/* Placeholder for an image about the company's story */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Company Story Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              These core principles guide everything we do at TutorTrend.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-lg font-medium text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              The passionate individuals behind TutorTrend.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 relative">
                  {/* Placeholder for team member image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl text-primary-700 font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium">{member.role}</p>
                  <p className="mt-3 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Join Our Mission</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Whether you're a learner seeking knowledge, an educator sharing expertise, or a professional joining our team, there's a place for you at TutorTrend.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg">Start Learning</Button>
              <Button size="lg" variant="outline">Become a Tutor</Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Have questions about TutorTrend? Find answers to common inquiries below.
            </p>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">How does TutorTrend work?</h3>
                <p className="mt-2 text-gray-600">
                  TutorTrend offers two main services: self-paced online courses and personalized tutoring. You can browse and enroll in courses to learn at your own pace, or book sessions with expert tutors for one-on-one guidance.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">How are tutors vetted?</h3>
                <p className="mt-2 text-gray-600">
                  All tutors undergo a rigorous application process that includes credential verification, background checks, and teaching demonstrations. We only accept tutors who demonstrate both subject expertise and teaching ability.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">What if I'm not satisfied with a course or tutor?</h3>
                <p className="mt-2 text-gray-600">
                  We offer a 30-day satisfaction guarantee for courses. If you're not completely satisfied, you can request a full refund. For tutoring sessions, if you're not happy with your first session, we'll match you with a different tutor or provide a refund.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Can I become a course instructor or tutor?</h3>
                <p className="mt-2 text-gray-600">
                  Yes! We're always looking for qualified educators to join our platform. Visit our "Teach on TutorTrend" page to learn about the application process and requirements.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Have more questions? Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
