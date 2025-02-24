'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send the form data to your backend
    // For now, we'll simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Neural network background */}
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="backdrop-blur-xl bg-black/50 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl -z-10" />
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center space-y-3 mb-8">
                      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                        Get in Touch
                      </h2>
                      <p className="text-gray-400">
                        Have questions about Beacon AI? I'd love to hear from you.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                          placeholder="Your message..."
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        className="relative w-full group overflow-hidden px-6 py-3 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                        <div className="relative flex items-center justify-center space-x-2">
                          <span className="text-white font-medium">
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </span>
                          <AnimatePresence mode="wait">
                            {!isSubmitting && (
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
                            {isSubmitting && (
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                    <p className="text-gray-400">
                      Thank you for reaching out. I'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors mt-4"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!submitted && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="flex items-start space-x-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>
                      Your message will be processed by our AI system for faster routing and response, while ensuring personal attention to your inquiry.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Prefer email?{' '}
                <a 
                  href="mailto:rgupta20@calpoly.edu"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  rgupta20@calpoly.edu
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
