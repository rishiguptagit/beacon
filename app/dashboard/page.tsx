'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

type UserPreferences = {
  zip_code: string;
  notification_preference: string;
  alert_radius: number;
  emergency_contacts: string;
  special_needs: boolean;
  special_needs_details: string;
  updated_at: string;
};

export default function Dashboard() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/personalize?email=user@example.com'); // TODO: Get from auth context
        const data = await response.json();

        if (data.success) {
          setPreferences(data.preferences);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <NeuralBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              Welcome to Beacon.AI
            </h1>
            <p className="text-gray-400">
              Your AI-powered emergency response dashboard
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Preferences Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-black/50 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your Preferences</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                  {error}
                </div>
              ) : preferences ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <p className="text-white">ZIP Code: {preferences.zip_code}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Notification Settings</label>
                    <p className="text-white capitalize">{preferences.notification_preference}</p>
                    <p className="text-gray-400">Alert Radius: {preferences.alert_radius} miles</p>
                  </div>
                  {preferences.emergency_contacts && (
                    <div>
                      <label className="text-sm text-gray-400">Emergency Contacts</label>
                      <p className="text-white whitespace-pre-line">{preferences.emergency_contacts}</p>
                    </div>
                  )}
                  {preferences.special_needs && (
                    <div>
                      <label className="text-sm text-gray-400">Special Assistance</label>
                      <p className="text-white">{preferences.special_needs_details}</p>
                    </div>
                  )}
                  <div className="pt-4">
                    <Link href="/personalize">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group overflow-hidden px-6 py-2 rounded-lg w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                        <span className="relative text-white font-medium">Update Preferences</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No preferences found</p>
                  <Link href="/personalize">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group overflow-hidden px-6 py-2 rounded-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                      <span className="relative text-white font-medium">Set Up Preferences</span>
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-black/50 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid gap-4">
                <button className="p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition-colors text-left group">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400">Report Incident</h3>
                  <p className="text-gray-400 text-sm">Submit a new incident report</p>
                </button>
                <button className="p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition-colors text-left group">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400">Emergency Contacts</h3>
                  <p className="text-gray-400 text-sm">Manage your emergency contacts</p>
                </button>
                <button className="p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition-colors text-left group">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400">Notification Settings</h3>
                  <p className="text-gray-400 text-sm">Update your alert preferences</p>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
