'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Neural network background animation component
const NeuralBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20" />
      <svg className="absolute w-full h-full opacity-[0.02]">
        <pattern id="neural-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="1" fill="currentColor" />
          <line x1="25" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" />
          <line x1="25" y1="25" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern)" />
      </svg>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <NeuralBackground />
      {/* Navigation Dashboard */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-b border-gray-800 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="relative group">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
                animate={{ 
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative px-4 py-2 rounded-lg leading-none flex items-center">
                <span className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    Beacon<span className="text-blue-500">.</span>
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-sm ml-2">AI</span>
                </span>
              </div>
            </Link>

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
                className="absolute top-16 right-4 w-48 backdrop-blur-xl bg-black/50 rounded-lg shadow-lg border border-gray-800 shadow-blue-500/10"
              >
                <div className="py-1">
                  <a href="/" className="block px-4 py-2 text-gray-300 hover:bg-white/5 transition-colors">About</a>
                  <a href="contact" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Contact</a>
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
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
            Beacon<span className="text-blue-500">.</span>AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            An AI-Powered Real-Time Incident Reporting and
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"> Coordination System</span>
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
                <div className="backdrop-blur-xl bg-black/30 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/5 group hover:shadow-blue-500/10">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Real-Time Incident Reporting
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Provide a platform for users to report incidents with geolocation, 
                    multimedia attachments, and severity levels.
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-black/30 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/5 group hover:shadow-blue-500/10">
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
                <div className="backdrop-blur-xl bg-black/30 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/5 group hover:shadow-blue-500/10">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                    Fault-Tolerant Notification System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Design a resilient notification mechanism that ensures information 
                    reaches the right stakeholders, even during network partitions or node failures.
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-black/30 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors shadow-lg shadow-blue-500/5 group hover:shadow-blue-500/10">
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
            <Link href="/signin">
              <motion.button
                className="relative group overflow-hidden px-8 py-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                <div className="relative flex items-center justify-center space-x-2">
                  <span className="text-white font-medium text-lg">
                    Get Started
                  </span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white"
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
