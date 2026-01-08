import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await authService.signOut();
    setLoading(false);
  };

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">
                    QuizMaster
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/dashboard'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-quiz"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/create-quiz'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Create Quiz
                  </Link>
                  <Link
                    to="/analytics"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/analytics'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Analytics
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <button
                        className="flex text-sm rounded-full focus:outline-none"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span className="inline-block h-8 w-8 rounded-full bg-indigo-500">
                          <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                      </button>
                      {dropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        <Outlet />
      </main>

      {!isAuthPage && (
        <footer className="bg-white mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} QuizMaster. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;