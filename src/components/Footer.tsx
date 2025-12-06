import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright Notice */}
          <p className="text-sm text-gray-500 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} FinanceApp. All rights reserved.
          </p>

          {/* Placeholder Links */}
          <div className="flex space-x-4 order-1 md:order-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
