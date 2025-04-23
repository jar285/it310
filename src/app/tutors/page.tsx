'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, BookOpen, Users, Filter } from 'lucide-react';

interface Tutor {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  hourlyRate: number | null;
  rating: number | null;
  reviewCount: number | null;
  location: string | null;
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // This would be fetched from an API in a real application
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Geography',
    'Foreign Languages',
    'Music',
    'Art',
  ];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tutors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tutors');
        }
        
        const data = await response.json();
        setTutors(data);
        setFilteredTutors(data);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutors();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    let results = tutors;
    
    // Filter by search term (name or specialization)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(tutor => 
        (tutor.user.name?.toLowerCase().includes(term) || false) || 
        (tutor.specialization?.toLowerCase().includes(term) || false)
      );
    }
    
    // Filter by subject
    if (selectedSubject) {
      results = results.filter(tutor => 
        tutor.specialization?.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }
    
    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(tutor => {
        if (!tutor.hourlyRate) return false;
        if (max) {
          return tutor.hourlyRate >= min && tutor.hourlyRate <= max;
        } else {
          return tutor.hourlyRate >= min;
        }
      });
    }
    
    setFilteredTutors(results);
  }, [searchTerm, selectedSubject, priceRange, tutors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setPriceRange('');
  };

  // Generate star rating display
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find Your Perfect Tutor
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Connect with expert tutors in various subjects to help you achieve your learning goals.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <div className="relative flex-1 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by name or specialization"
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range ($/hour)
                  </label>
                  <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Price</SelectItem>
                      <SelectItem value="0-25">$0 - $25</SelectItem>
                      <SelectItem value="25-50">$25 - $50</SelectItem>
                      <SelectItem value="50-75">$50 - $75</SelectItem>
                      <SelectItem value="75-100">$75 - $100</SelectItem>
                      <SelectItem value="100-">$100+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tutors Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {tutor.user.image ? (
                          <Image 
                            src={tutor.user.image} 
                            alt={tutor.user.name || 'Tutor'} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-semibold">
                            {tutor.user.name ? tutor.user.name.charAt(0).toUpperCase() : 'T'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tutor.user.name || 'Anonymous Tutor'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {tutor.specialization || 'General Tutor'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 line-clamp-3">
                        {tutor.bio || 'This tutor has not added a bio yet.'}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {tutor.experience !== null && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {tutor.experience} {tutor.experience === 1 ? 'year' : 'years'} of experience
                          </span>
                        </div>
                      )}
                      
                      {tutor.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{tutor.location}</span>
                        </div>
                      )}
                      
                      {tutor.rating !== null && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {renderStars(tutor.rating)}
                            {tutor.reviewCount && (
                              <span className="ml-1 text-xs text-gray-500">
                                ({tutor.reviewCount} {tutor.reviewCount === 1 ? 'review' : 'reviews'})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {tutor.hourlyRate ? (
                        <span className="text-lg font-semibold text-gray-900">
                          ${tutor.hourlyRate.toFixed(2)}/hour
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Rate not specified</span>
                      )}
                      
                      <Link href={`/tutors/${tutor.id}`}>
                        <Button>View Profile</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination - would be implemented in a real application */}
          {!loading && !error && filteredTutors.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="mx-2">Previous</Button>
              <Button variant="outline" className="mx-2">Next</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
