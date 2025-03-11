'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import ThemeToggle from '../components/theme-toggle';

export default function About() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="relative w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Beacon</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">AI</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-4">
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  About Beacon
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  A Cal Poly San Luis Obispo senior project connecting communities with critical information during natural disasters. Using AI technology, we provide real-time updates and safety recommendations to help people stay informed and prepared.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About the Developer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Developed at California Polytechnic State University, San Luis Obispo, this project combines computer science expertise with a passion for community impact.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Key Features
              </h2>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Real-time Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Instant notifications about natural disasters in your area.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Community Connection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Connect with local resources during emergency situations.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Smart recommendations for emergency preparedness and response.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                >
                  <span>Get in touch</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
