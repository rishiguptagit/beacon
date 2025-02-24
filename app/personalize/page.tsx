'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
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

export default function PersonalizePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    zipCode: '',
    notificationPreference: 'all',
    alertRadius: '10',
    emergencyContacts: '',
    specialNeeds: false,
    specialNeedsDetails: ''
  });

  const steps = [
    {
      title: 'Location',
      description: 'Help us provide relevant alerts for your area',
      fields: ['zipCode']
    },
    {
      title: 'Notifications',
      description: 'Customize how you want to be notified',
      fields: ['notificationPreference', 'alertRadius']
    },
    {
      title: 'Emergency Contacts',
      description: 'Add emergency contacts for critical situations',
      fields: ['emergencyContacts']
    },
    {
      title: 'Special Needs',
      description: 'Tell us about any special assistance requirements',
      fields: ['specialNeeds', 'specialNeedsDetails']
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
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
        router.push('/dashboard');
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter your ZIP code"
            />
          </div>
        );
      case 'notificationPreference':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Notification Preference</label>
            <select
              value={formData.notificationPreference}
              onChange={(e) => handleInputChange('notificationPreference', e.target.value)}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
            >
              <option value="all">All Notifications</option>
              <option value="critical">Critical Only</option>
              <option value="none">None</option>
            </select>
          </div>
        );
      case 'alertRadius':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Alert Radius (miles)</label>
            <input
              type="range"
              min="1"
              max="50"
              value={formData.alertRadius}
              onChange={(e) => handleInputChange('alertRadius', e.target.value)}
              className="w-full"
            />
            <div className="text-center text-gray-400">{formData.alertRadius} miles</div>
          </div>
        );
      case 'emergencyContacts':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Emergency Contacts</label>
            <textarea
              value={formData.emergencyContacts}
              onChange={(e) => handleInputChange('emergencyContacts', e.target.value)}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter emergency contact information"
              rows={4}
            />
          </div>
        );
      case 'specialNeeds':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.specialNeeds}
                onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-700 bg-black/50 rounded focus:ring-offset-0 focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-300">I require special assistance during emergencies</label>
            </div>
            {formData.specialNeeds && (
              <textarea
                value={formData.specialNeedsDetails}
                onChange={(e) => handleInputChange('specialNeedsDetails', e.target.value)}
                className="w-full px-4 py-2 border border-gray-800 rounded-lg bg-black/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Please provide details about your special assistance requirements"
                rows={4}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <NeuralBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              Personalize Your Experience
            </h1>
            <p className="text-gray-400">
              Let's customize Beacon.AI to better serve your needs
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-500' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  {index + 1}
                </div>
                <div className="text-xs">{step.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="backdrop-blur-xl bg-black/50 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10"
          >
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
                <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {steps[currentStep].fields.map(field => renderField(field))}
              </div>

              <div className="flex justify-between pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  className={`px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (currentStep === steps.length - 1) {
                      handleSubmit();
                    } else {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  className="relative group overflow-hidden px-6 py-2 rounded-lg disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-110" />
                  <div className="relative flex items-center justify-center space-x-2">
                    <span className="text-white font-medium">
                      {currentStep === steps.length - 1
                        ? (isSubmitting ? 'Saving...' : 'Complete Setup')
                        : 'Next'}
                    </span>
                    {isSubmitting && currentStep === steps.length - 1 && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
