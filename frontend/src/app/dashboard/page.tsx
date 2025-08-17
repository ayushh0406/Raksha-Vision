'use client';

import { motion } from 'framer-motion';
import React from 'react';

// Animation configs (DRY principle)
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-6">
          Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Alerts" value="12" color="danger" />
          <StatCard title="Online Cameras" value="24/28" color="success" />
          <StatCard title="Active Sensors" value="42/45" color="primary" />
          <StatCard title="System Health" value="98%" color="success" />
        </div>

        {/* Map + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card title="Live Map">
              <Placeholder text="Map would be displayed here" />
            </Card>
          </div>

          {/* Alerts */}
          <Card title="Recent Alerts">
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
}

/* ---------- Reusable Components ---------- */

type StatCardProps = {
  title: string;
  value: string;
  color: 'primary' | 'success' | 'danger' | 'warning';
};

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses: Record<StatCardProps['color'], string> = {
    primary:
      'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400',
    success:
      'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400',
    danger:
      'bg-danger-100 dark:bg-danger-900 text-danger-600 dark:text-danger-400',
    warning:
      'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400',
  };

  return (
    <motion.div
      {...fadeInUp}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6 theme-transition"
    >
      <h3 className="text-lg font-medium text-dark-500 dark:text-dark-300 mb-2">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
    </motion.div>
  );
}

type AlertItemProps = {
  title: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

function AlertItem({ title, location, time, severity }: AlertItemProps) {
  const severityClasses: Record<AlertItemProps['severity'], string> = {
    low: 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400',
    medium:
      'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400',
    high: 'bg-danger-100 dark:bg-danger-900 text-danger-600 dark:text-danger-400',
    critical:
      'bg-danger-200 dark:bg-danger-800 text-danger-700 dark:text-danger-300',
  };

  return (
    <div className="flex items-start space-x-3 p-3 bg-dark-50 dark:bg-dark-700 rounded-lg theme-transition">
      <div
        className={`w-3 h-3 rounded-full mt-1.5 ${severityClasses[severity]}`}
      />
      <div>
        <h4 className="font-medium text-dark-800 dark:text-dark-100">{title}</h4>
        <p className="text-sm text-dark-500 dark:text-dark-400">{location}</p>
        <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-6 h-full theme-transition">
      <h2 className="text-xl font-bold text-dark-800 dark:text-dark-100 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="bg-dark-100 dark:bg-dark-700 rounded-lg h-64 lg:h-80 flex items-center justify-center">
      <p className="text-dark-500 dark:text-dark-300">{text}</p>
    </div>
  );
}
