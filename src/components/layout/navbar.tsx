'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItemCount } = useCart();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSignIn = () => {
    // Store the current path to redirect back after login
    if (pathname !== '/auth/login' && pathname !== '/auth/register') {
      localStorage.setItem('loginRedirect', pathname);
    }
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    // Store the current path to redirect back after registration
    if (pathname !== '/auth/login' && pathname !== '/auth/register') {
      localStorage.setItem('loginRedirect', pathname);
    }
    router.push('/auth/register');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Tutors', href: '/tutors' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                TutorTrend
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === link.href ? 'border-b-2 border-primary-500 text-gray-900' : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link href="/cart" className="text-gray-500 hover:text-gray-700 relative">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <User className="h-6 w-6 mr-1" />
                    <span className="text-sm font-medium">{session?.user?.name || 'Dashboard'}</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Sign out</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignIn}
                  className="flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  <span>Sign in</span>
                </Button>
                <Button 
                  onClick={handleSignUp}
                  size="sm"
                  className="flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  <span>Sign up</span>
                </Button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Link href="/cart" className="text-gray-500 hover:text-gray-700 mr-2 relative">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`border-l-4 py-2 pl-3 pr-4 text-base font-medium ${pathname === link.href ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'}`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {isLoading ? (
              <div className="px-4 py-2 flex justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-base font-medium text-gray-800">{session?.user?.name}</p>
                  <p className="text-sm font-medium text-gray-500">{session?.user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 flex items-center"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/cart"
                  className="border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 flex items-center"
                  onClick={closeMenu}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="border-l-4 border-transparent w-full text-left py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Button
                  onClick={handleSignIn}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="w-full justify-start"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
