'use client';

import { useState, useEffect } from 'react';
import { Level } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';

interface CourseFiltersProps {
  categories: string[];
}

export default function CourseFilters({ categories }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'featured',
  });

  const levels = Object.values(Level);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.level) params.set('level', filters.level);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    
    router.push(`/courses?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      level: '',
      minPrice: '',
      maxPrice: '',
      sort: 'featured',
    });
    router.push('/courses');
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Category</h3>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Level</h3>
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
              Min ($)
            </label>
            <input
              type="number"
              name="minPrice"
              id="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
              Max ($)
            </label>
            <input
              type="number"
              name="maxPrice"
              id="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
