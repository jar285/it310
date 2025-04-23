'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Book, Clock, Award, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  enrollmentDate: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    duration: number;
    level: string;
    tutor: {
      id: string;
      user: {
        name: string;
      };
    };
  };
}

export default function DashboardCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Check if we're coming from checkout success
  const fromCheckout = searchParams.get('from') === 'checkout';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/courses');
      return;
    }

    if (status === 'authenticated') {
      fetchEnrolledCourses();
    }
  }, [status, router]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      // Add a cache-busting parameter to ensure we get fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/enrollments?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      
      const data = await response.json();
      console.log('Fetched enrollments:', data);
      
      // Store debug info
      setDebugInfo({
        responseStatus: response.status,
        responseData: data,
        timestamp: new Date().toISOString(),
        session: session ? { id: session.user?.id, email: session.user?.email } : null
      });
      
      setEnrolledCourses(data.enrollments || []);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to load your courses. Please try again later.');
      setDebugInfo({
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Force a refresh of enrollments if coming from checkout
  useEffect(() => {
    if (fromCheckout && !loading && status === 'authenticated') {
      console.log('Coming from checkout, refreshing enrollments...');
      fetchEnrolledCourses();
    }
  }, [fromCheckout, status]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEnrolledCourses();
  };

  // Manually verify payment if coming from checkout
  useEffect(() => {
    const verifyPayment = async () => {
      if (fromCheckout && status === 'authenticated') {
        const paymentIntent = searchParams.get('payment_intent');
        if (paymentIntent) {
          try {
            console.log('Verifying payment from courses page:', paymentIntent);
            const response = await fetch(`/api/payment/verify?payment_intent=${paymentIntent}`);
            const data = await response.json();
            console.log('Payment verification from courses page:', data);
            if (data.success) {
              fetchEnrolledCourses();
            }
          } catch (err) {
            console.error('Error verifying payment from courses page:', err);
          }
        }
      }
    };
    
    verifyPayment();
  }, [fromCheckout, searchParams, status]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <Link href="/courses">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md">
              Browse Courses
            </button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-2 text-gray-600">Continue learning where you left off</p>
          </div>
          <button 
            onClick={handleRefresh} 
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Debug information - only visible in development */}
        {process.env.NODE_ENV !== 'production' && debugInfo && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-yellow-700">Debug Information</h3>
            </div>
            <pre className="text-xs overflow-auto max-h-40 bg-yellow-100 p-2 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">You haven't enrolled in any courses yet</h2>
            <p className="text-gray-600 mb-6">Browse our catalog and find the perfect course for you</p>
            <Link href="/courses">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md">
                Browse Courses
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  {enrollment.course.imageUrl ? (
                    <Image 
                      src={enrollment.course.imageUrl} 
                      alt={enrollment.course.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Book className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center">
                      <div className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {enrollment.course.level}
                      </div>
                      <div className="ml-2 bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {enrollment.course.duration} mins
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{enrollment.course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Instructor: {enrollment.course.tutor.user.name}
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Enrolled on {formatDate(enrollment.enrollmentDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <Link 
                    href={`/dashboard/courses/${enrollment.course.id}`}
                    className="flex items-center justify-center w-full bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Continue Learning
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
