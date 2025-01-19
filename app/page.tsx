'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function IntroPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation Dashboard */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-2xl font-bold text-black dark:text-white">
              Beacon<span className="text-blue-500">.</span>
            </div>

            {/* Menu Button */}
            <button 
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <svg 
                className="w-6 h-6 text-gray-600 dark:text-gray-400" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">About</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Features</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Contact</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-black dark:text-white mb-6">
            Beacon
            <span className="text-blue-500">.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A Real-Time Incident Reporting and 
            <span className="text-blue-500"> Coordination System</span>
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose lg:prose-lg mx-auto"
          >
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              In today's interconnected world, timely and efficient responses to incidents such as natural disasters, 
              accidents, and emergencies are critical to minimizing damage and ensuring public safety.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              Find out how Beacon can help you respond to incidents in real-time.
            </p>
          </motion.section>

          {/* Project Goals */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-12">Project Goals</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Real-Time Incident Reporting
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Provide a platform for users to report incidents with geolocation, 
                    multimedia attachments, and severity levels.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Distributed Data Aggregation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use distributed databases and message queues to aggregate, process, 
                    and analyze reports across geographically distributed nodes.
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Fault-Tolerant Notification System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Design a resilient notification mechanism that ensures information 
                    reaches the right stakeholders, even during network partitions or node failures.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Scalable Architecture
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Implement a cloud-native system capable of scaling dynamically 
                    to handle workload surges during widespread emergencies.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center pt-12"
          >
            <Link href="/login">
              <button className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-colors text-lg">
                Get Started →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
