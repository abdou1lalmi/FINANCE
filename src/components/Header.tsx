import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  // Placeholder for authentication state
  const isAuthenticated = false; // This will be replaced with actual auth logic later

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', protected: true },
    { href: '/transactions', label: 'Transactions', protected: true },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/App Name */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            FinanceApp
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => {
              if (!link.protected || isAuthenticated) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out"
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out">
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out hidden sm:inline"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <button className="md:hidden text-gray-600 hover:text-indigo-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
