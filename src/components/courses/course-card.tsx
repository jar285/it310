'use client';

import { Course, Level } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';

interface CourseCardProps {
  course: Course & {
    tutor?: {
      id: string;
      name: string;
    };
    _count?: {
      reviews: number;
    };
    averageRating?: number;
    featured?: boolean;
  };
}

// Define color mapping for each level
const levelColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-blue-100 text-blue-800',
  ADVANCED: 'bg-purple-100 text-purple-800',
};

export default function CourseCard({ course }: CourseCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { incrementCartCount, updateCartCount } = useCart();
  
  // Format price to 2 decimal places with currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(course.price);

  // Format duration from minutes to hours and minutes
  const hours = Math.floor(course.duration / 60);
  const minutes = course.duration % 60;
  const formattedDuration = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`;

  // Get the color for the level or use a default if not found
  const levelColor = levelColors[course.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to course detail page
    e.stopPropagation(); // Stop event propagation
    
    if (!session) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/courses`)}`);
      return;
    }
    
    try {
      setIsAddingToCart(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
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
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-300">
      {course.featured && (
        <div className="absolute left-0 top-4 z-10 bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          Featured
        </div>
      )}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No image available
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${levelColor}`}>
            {course.level}
          </span>
          <span className="text-sm text-gray-500">{formattedDuration}</span>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-2">
          <Link href={`/courses/${course.id}`} className="hover:text-primary-600">
            {course.title}
          </Link>
        </h3>
        <p className="mb-3 text-sm text-gray-500 line-clamp-2">{course.description}</p>
        <div className="mb-2 flex items-center">
          {course.tutor && (
            <Link href={`/tutors/${course.tutor.id}`} className="text-sm font-medium text-gray-700 hover:text-primary-600">
              {course.tutor.name}
            </Link>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="mr-1 text-sm font-medium text-gray-900">
              {course.averageRating?.toFixed(1) || 'New'}
            </span>
            {course._count?.reviews && (
              <span className="text-xs text-gray-500">({course._count.reviews})</span>
            )}
          </div>
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
        </div>
        
        {/* Add to Cart Button */}
        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            View Details
          </Link>
          <Button 
            onClick={handleAddToCart} 
            size="sm" 
            className="flex items-center gap-1"
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-primary-600 bg-opacity-0 opacity-0 transition-all duration-300 group-hover:bg-opacity-5 group-hover:opacity-100">
        <Link
          href={`/courses/${course.id}`}
          className="transform scale-95 transition-transform duration-300 group-hover:scale-100 rounded-md bg-white border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
