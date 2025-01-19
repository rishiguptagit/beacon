'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName: name,
          password,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/login'); // Redirect to login page
      } else {
        alert(data.error || 'Signup failed'); // Basic error handling
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Logo */}
          <Link href="/" className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Beacon<span className="text-blue-500">.</span>
            </h1>
          </Link>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-8">
                Create your account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-500 hover:text-blue-600">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create account →
                </button>
              </form>
            </div>

            {/* Login link */}
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Log in →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
