'use client'
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { Star, Clock, BookOpen, Award, Users, Calendar, Globe, ShoppingCart } from 'lucide-react';
import { Level } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  duration: number;
  level: Level;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    id: string;
    specialization: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }[];
  _count?: {
    reviews: number;
  };
  averageRating?: number;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  // Unwrap params using React.use() with proper type assertion
  const unwrappedParams = use(params as any) as { id: string };
  const courseId = unwrappedParams.id;
  
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { incrementCartCount, updateCartCount } = useCart();
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        
        const data = await response.json();
        setCourse(data);
        
        // Fetch related courses from the same category
        if (data.category) {
          const relatedResponse = await fetch(`/api/courses?category=${encodeURIComponent(data.category)}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current course
            setRelatedCourses(relatedData.courses.filter((c: any) => c.id !== courseId));
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  const handleAddToCart = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/courses/${courseId}`)}`);
      return;
    }
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId,
          quantity: 1,
        }),
      });
      
      if (response.ok) {
        // Optimistically bump badge
        incrementCartCount();
        // Sync with backend
        await updateCartCount();
        // Redirect to cart
        router.push('/cart');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add course to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error message
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !course) {
    return (
      <MainLayout>
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Course not found'}</h2>
          <Link href="/courses">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 shadow-md transition-colors">Browse Courses</button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="relative h-64 md:h-80 w-full bg-gray-200">
              {course.imageUrl ? (
                <Image 
                  src={course.imageUrl} 
                  alt={course.title} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              
              {course.featured && (
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Featured
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.category}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              
              <div className="flex items-center mb-4">
                {course.averageRating ? (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.round(course.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {course.averageRating.toFixed(1)} ({course._count?.reviews || 0} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No ratings yet</span>
                )}
              </div>
              
              <div className="flex items-center mb-6">
                {course.tutor && (
                  <div className="flex items-center mr-6">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                      {course.tutor.user.image ? (
                        <Image 
                          src={course.tutor.user.image} 
                          alt={course.tutor.user.name || 'Tutor'} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xs font-semibold">
                          {course.tutor.user.name ? course.tutor.user.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {course.tutor.user.name || 'Anonymous Tutor'}
                      </span>
                      <p className="text-xs text-gray-500">{course.tutor.specialization}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated {formatDate(course.updatedAt)}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {Math.floor(course.duration / 60)}h {course.duration % 60}m
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {course.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      English
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900 mr-4">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(course.price)}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 shadow-md flex items-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Course Description */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
                </div>
              </div>
              
              {/* Course Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>
                
                {course.reviews && course.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {course.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start mb-2">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                            {review.user.image ? (
                              <Image 
                                src={review.user.image} 
                                alt={review.user.name || 'User'} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-semibold">
                                {review.user.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.user.name || 'Anonymous User'}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400' : 'fill-gray-200'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
                
                {course._count?.reviews && course._count.reviews > 3 && (
                  <div className="mt-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 shadow-md transition-colors w-full">See All Reviews</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Related Courses */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Courses</h2>
                {relatedCourses.length > 0 ? (
                  <div className="space-y-4">
                    {relatedCourses.map((relatedCourse) => (
                      <div key={relatedCourse.id} className="flex items-start">
                        <div className="relative h-16 w-24 bg-gray-200 rounded mr-3 flex-shrink-0">
                          {relatedCourse.imageUrl ? (
                            <Image 
                              src={relatedCourse.imageUrl} 
                              alt={relatedCourse.title} 
                              fill 
                              className="object-cover rounded" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">
                            <Link href={`/courses/${relatedCourse.id}`} className="hover:text-primary-600">
                              {relatedCourse.title}
                            </Link>
                          </h3>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-600 ml-1">
                              {relatedCourse.averageRating?.toFixed(1) || 'New'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(relatedCourse.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No related courses found.</p>
                )}
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
