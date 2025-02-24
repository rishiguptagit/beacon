'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/personalize'); // Redirect to dashboard on success
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <NeuralBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Logo */}
          <Link href="/" className="mb-8 relative group">
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
            <div className="relative bg-black px-6 py-4 rounded-lg leading-none flex items-center">
              <span className="flex items-center space-x-2">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Beacon<span className="text-blue-500">.</span>
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-sm ml-2">AI</span>
              </span>
            </div>
          </Link>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-black/50 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl -z-10" />
              <motion.div className="text-center space-y-3 mb-8">
                <motion.h2 
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome to Beacon AI
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-400 max-w-sm mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Your intelligent emergency response platform powered by advanced machine learning
                </motion.p>
                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <motion.span
                      className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Real-time Analysis
                  </span>
                  <span className="flex items-center">
                    <motion.span
                      className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    Predictive Alerts
                  </span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
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
                    className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-500 border-gray-700 bg-black/50 rounded focus:ring-offset-0 focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>

                    <Link 
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>
                        Beacon AI uses advanced neural networks to analyze emergency patterns and provide real-time insights for faster response times.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="relative w-full group overflow-hidden px-6 py-3 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                  <div className="relative flex items-center justify-center space-x-2">
                    <span className="text-white font-medium">
                      {isLoading ? 'Authenticating...' : 'Sign in'}
                    </span>
                    <AnimatePresence mode="wait">
                      {!isLoading && (
                        <motion.span
                          key="arrow"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-white"
                        >
                          →
                        </motion.span>
                      )}
                      {isLoading && (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </form>
            </div>

            {/* Sign up link */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ML-Powered</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Real-time</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Predictive</span>
                </span>
              </div>
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign up →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
