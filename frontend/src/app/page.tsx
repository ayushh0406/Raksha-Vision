'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 theme-transition">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary-600 dark:text-primary-400 mb-6">
            Border Surveillance System
          </h1>
          <p className="text-xl md:text-2xl text-dark-600 dark:text-dark-300 mb-8 max-w-3xl mx-auto">
            Advanced AI and Multi-Sensor Fusion for Real-Time Border Intrusion Detection
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <FeatureCard
            title="AI-Powered Detection"
            description="Utilizes advanced object detection models to identify and classify intruders with high accuracy."
            delay={0.4}
          />
          <FeatureCard
            title="Multi-Sensor Fusion"
            description="Combines data from cameras, fiber optic sensors, laser tripwires, and seismic sensors for comprehensive coverage."
            delay={0.5}
          />
          <FeatureCard
            title="Real-Time Alerts"
            description="Instant notifications and alerts when suspicious activities are detected at the border."
            delay={0.6}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/dashboard"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-card hover:shadow-card-hover p-6 transition-all duration-300 theme-transition"
    >
      <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">{title}</h3>
      <p className="text-dark-600 dark:text-dark-300">{description}</p>
    </motion.div>
  );
} 