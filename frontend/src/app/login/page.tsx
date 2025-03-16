'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 theme-transition">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-card p-8 max-w-md w-full mx-4 theme-transition"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Login to Border Surveillance System</h1>
          <p className="text-dark-500 dark:text-dark-400 mt-2">Enter your credentials to access the system</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white theme-transition"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white theme-transition"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-700 dark:text-dark-300">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Forgot password?
              </a>
            </div>
          </div>
          
          <div>
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign in
            </Link>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Contact administrator
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 