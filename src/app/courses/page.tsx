'use client'
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CourseGrid from '@/components/courses/course-grid';
import CourseFilters from '@/components/courses/course-filters';
import { useSearchParams, useRouter } from 'next/navigation';
import { Course, Level } from '@prisma/client';

type CourseWithRelations = Course & {
  tutor?: {
    id: string;
    name: string;
  };
  _count?: {
    reviews: number;
  };
  averageRating?: number;
};

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  // Get query parameters
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'featured';
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

  useEffect(() => {
    // Set the search query from URL if it exists
    if (query) {
      setSearchQuery(query);
    }
    
    // Set the current page from URL
    setCurrentPage(page);

    // Fetch categories
    fetchCategories();
    
    // Fetch courses based on filters
    fetchCourses();
  }, [query, category, level, minPrice, maxPrice, sort, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/courses/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Build query string with all filters
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (category) params.set('category', category);
      if (level) params.set('level', level);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', coursesPerPage.toString());

      const response = await fetch(`/api/courses?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setTotalCourses(data.total);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('query', searchQuery);
    } else {
      params.delete('query');
    }
    params.set('page', '1'); // Reset to first page on new search
    router.push(`/courses?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/courses?${params.toString()}`);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="mt-1 text-lg text-gray-600">Browse our catalog of courses</p>
            </div>
            <div className="mt-4 md:mt-0">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative rounded-md shadow-sm max-w-xs">
                  <Input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="pr-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button type="submit" className="sr-only">Search</button>
              </form>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Filters */}
            <div className="hidden md:block">
              <CourseFilters categories={categories} />
            </div>

            {/* Course Grid */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex h-64 w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <CourseGrid courses={courses} />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum ? 'bg-primary-50 text-primary-600' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
