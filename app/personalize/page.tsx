'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function PersonalizePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    zipCode: ''
  });

  type FormDataValue = string | boolean | string[];

  const steps = [
    {
      title: 'Location',
      description: 'Help us provide relevant alerts for your area',
      fields: ['zipCode']
    }
  ];

  const handleInputChange = (field: string, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: 'user@example.com', // TODO: Get from auth context
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/map');
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: string) => {
    switch (field) {
      case 'zipCode':
        return (
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your ZIP code"
            />
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden flex flex-col">
      {/* Dashboard Header */}
      <header className="relative w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Beacon</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">AI</span>
              </Link>
            </div>
          </div>
        </div>
      </header>


      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5"
        >
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="text-center mb-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personalize Your Experience
              </h1>
            </div>

            {/* Form Content */}
            <div className="flex-1">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}
              
              <div className="max-w-md mx-auto w-full">
                {steps.map((step, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="mb-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {step.fields.map(field => (
                        <div key={field}>
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 hover:bg-blue-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span>Saving...</span>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    'Save Preferences'
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
