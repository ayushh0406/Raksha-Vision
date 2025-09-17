'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

/* ---------- Animation Configs ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ---------- Dashboard ---------- */
const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-6"
        >
          Dashboard
        </motion.h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Alerts" value="12" color="danger" />
          <StatCard title="Online Cameras" value="24/28" color="success" />
          <StatCard title="Active Sensors" value="42/45" color="primary" />
          <StatCard title="System Health" value="98%" color="success" />
        </div>

        {/* Map + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card title="Live Map">
              <Placeholder text="Map would be displayed here" />
            </Card>
          </div>
          <Card title="Recent Alerts">
            <AnimatePresence>
              <div className="space-y-4">
                <AlertItem
                  title="Human Intrusion Detected"
                  location="Zone B, North Sector"
                  time="2 minutes ago"
                  severity="high"
                />
                <AlertItem
                  title="Vehicle Detected"
                  location="Zone C, East Sector"
                  time="15 minutes ago"
                  severity="medium"
                />
                <AlertItem
                  title="Unknown Object"
                  location="Zone A, West Sector"
                  time="32 minutes ago"
                  severity="low"
                />
              </div>
            </AnimatePresence>
          </Card>
        </div>

        {/* Camera + Sensors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Camera Feed">
            <Placeholder text="Camera feed would be displayed here" />
          </Card>
          <Card title="Sensor Activity">
            <Placeholder text="Sensor activity chart would be displayed here" />
          </Card>
        </div>
      </motion.div>
    </div>
  );
