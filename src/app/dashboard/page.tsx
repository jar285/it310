'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { Book, Clock, Award, ShoppingBag, User, Calendar, CheckCircle, BookOpen, RefreshCw } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  tutor: {
    id: string;
    user: {
      name: string | null;
    };
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    course: {
      id: string;
      title: string;
      imageUrl: string | null;
    };
  }[];
}

interface Enrollment {
  id: string;
  enrollmentDate: string;
  completionDate: string | null;
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
        name: string | null;
      };
    };
  };
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  profile?: {
    bio: string | null;
    phoneNumber: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
  };
}

interface EnrollmentStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0
  });
  const [enrollmentStats, setEnrollmentStats] = useState<EnrollmentStats>({
    totalEnrollments: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      
      // Fetch user profile
      const profileResponse = await fetch(`/api/profile?t=${timestamp}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }
      
      // Fetch enrollments (purchased courses)
      const enrollmentsResponse = await fetch(`/api/enrollments?t=${timestamp}`);
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        console.log('Dashboard enrollments data:', enrollmentsData);
        setEnrollments(enrollmentsData.enrollments || []);
      }
      
      // Fetch enrollment stats
      const enrollmentStatsResponse = await fetch(`/api/enrollments/stats?t=${timestamp}`);
      if (enrollmentStatsResponse.ok) {
        const enrollmentStatsData = await enrollmentStatsResponse.json();
        setEnrollmentStats(enrollmentStatsData);
      }
      
      // Fetch orders
      const ordersResponse = await fetch(`/api/orders?t=${timestamp}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        console.log('Dashboard orders data:', ordersData);
        setRecentOrders(ordersData.orders || []);
      }
      
      // Fetch order stats
      const statsResponse = await fetch(`/api/orders/stats?t=${timestamp}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setOrderStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={handleRefresh} 
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Book className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{enrollmentStats.totalEnrollments}</span>
              <span className="ml-2 text-sm text-gray-500">enrolled</span>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all courses →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{Math.round(enrollmentStats.averageProgress)}%</span>
              <span className="ml-2 text-sm text-gray-500">average completion</span>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${enrollmentStats.averageProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{orderStats.totalOrders}</span>
              <span className="ml-2 text-sm text-gray-500">total</span>
            </div>
            <div className="mt-4">
              <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View order history →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Spent</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(orderStats.totalSpent)}</span>
              <span className="ml-2 text-sm text-gray-500">on education</span>
            </div>
            <div className="mt-4">
              <Link href="/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Browse more courses →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
                <Link href="/dashboard/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all
                </Link>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto h-16 w-16 text-gray-400">
                    <BookOpen className="h-full w-full" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No courses yet</h3>
                  <p className="mt-2 text-gray-600">Enroll in a course to start your learning journey</p>
                  <div className="mt-6">
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="p-6 flex items-start">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        {enrollment.course.imageUrl ? (
                          <Image 
                            src={enrollment.course.imageUrl} 
                            alt={enrollment.course.title} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <Book className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <h3 className="text-base font-medium text-gray-900">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-500">
                          Instructor: {enrollment.course.tutor.user.name}
                        </p>
                        
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-600" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Link 
                          href={`/dashboard/courses/${enrollment.course.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto h-16 w-16 text-gray-400">
                    <ShoppingBag className="h-full w-full" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-2 text-gray-600">Your purchase history will appear here</p>
                  <div className="mt-6">
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.slice(0, 3).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              href={`/orders/${order.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* User Profile & Stats */}
          <div className="space-y-8">
            {/* User Profile */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                  {userProfile?.image ? (
                    <Image 
                      src={userProfile.image} 
                      alt={userProfile.name || 'User'} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">{userProfile?.name || 'User'}</h2>
                  <p className="text-sm text-gray-600">{userProfile?.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {userProfile?.profile?.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Bio</h4>
                    <p className="text-sm text-gray-600 mt-1">{userProfile.profile.bio}</p>
                  </div>
                )}
                
                {userProfile?.profile?.phoneNumber && (
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-900 w-24">Phone:</span>
                    <span className="text-sm text-gray-600">{userProfile.profile.phoneNumber}</span>
                  </div>
                )}
                
                {userProfile?.profile?.address && (
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-900 w-24">Address:</span>
                    <span className="text-sm text-gray-600">
                      {userProfile.profile.address}, 
                      {userProfile.profile.city && ` ${userProfile.profile.city},`}
                      {userProfile.profile.state && ` ${userProfile.profile.state},`}
                      {userProfile.profile.zipCode && ` ${userProfile.profile.zipCode},`}
                      {userProfile.profile.country && ` ${userProfile.profile.country}`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link href="/profile">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </Link>
              </div>
            </div>
            
            {/* Learning Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Stats</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Book className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{enrollmentStats.totalEnrollments} Courses</h3>
                    <p className="text-xs text-gray-500">Enrolled in your learning journey</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{enrollmentStats.completedCourses} Completed</h3>
                    <p className="text-xs text-gray-500">Courses you've finished</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{Math.round(enrollmentStats.averageProgress)}% Average</h3>
                    <p className="text-xs text-gray-500">Overall course completion</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{formatPrice(orderStats.totalSpent)}</h3>
                    <p className="text-xs text-gray-500">Invested in your education</p>
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
