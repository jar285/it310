'use client';

import { useState } from 'react';
import { Level } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

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

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
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
    <aside className="sticky top-24 w-full md:w-64 flex-shrink-0">
      <div className="p-5 bg-white rounded-xl shadow-sm space-y-5">
        {/* Active chips */}
        {(filters.category ||
          filters.level ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.sort !== 'featured') && (
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Category: {filters.category}
              </span>
            )}
            {filters.level && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Level:{' '}
                {filters.level.charAt(0) +
                  filters.level.slice(1).toLowerCase()}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Price: {filters.minPrice || '0'} –{' '}
                {filters.maxPrice || 'Any'}
              </span>
            )}
          </div>
        )}

        {/* Sort / Category / Level */}
        {/** common classes for selects/inputs **/}
        {/*
          border-gray-200: lighter border
          rounded-lg: softer corners
          px-4 py-2: roomy touch targets
          text-sm text-gray-700: lighter text
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500
          transition
        */}
        {[
          {
            label: 'Sort By',
            name: 'sort',
            type: 'select',
            options: [
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
            ],
          },
          {
            label: 'Category',
            name: 'category',
            type: 'select',
            options: [
              { value: '', label: 'All Categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            label: 'Level',
            name: 'level',
            type: 'select',
            options: [
              { value: '', label: 'All Levels' },
              ...levels.map((lvl) => ({
                value: lvl,
                label:
                  lvl.charAt(0) +
                  lvl.slice(1).toLowerCase(),
              })),
            ],
          },
        ].map(({ label, name, type, options }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">
              {label}
            </label>
            <select
              name={name}
              value={(filters as any)[name]}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition"
            >
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price Range
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              name="minPrice"
              id="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min={0}
              placeholder="Min $"
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition"
            />
            <input
              type="number"
              name="maxPrice"
              id="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min={0}
              placeholder="Max $"
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-start gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center shadow-sm w-auto transition focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <Filter className="w-4 h-4 mr-1" />
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg px-4 py-2 w-auto transition"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}
