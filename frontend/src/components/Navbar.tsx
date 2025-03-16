'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SensorsIcon from '@mui/icons-material/Sensors';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Cameras', href: '/cameras', icon: <CameraAltIcon /> },
    { name: 'Sensors', href: '/sensors', icon: <SensorsIcon /> },
    { name: 'Alerts', href: '/alerts', icon: <NotificationsIcon /> },
    { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <nav className="bg-white dark:bg-dark-900 shadow-md dark:shadow-dark-800 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Border Surveillance
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-dark-500 hover:text-dark-700 dark:text-dark-300 dark:hover:text-dark-100'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium theme-transition`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ThemeToggle />
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-600 dark:text-dark-300">
                  {user.full_name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-dark-500 hover:text-dark-700 dark:text-dark-300 dark:hover:text-dark-100 focus:outline-none"
                  aria-label="Logout"
                >
                  <LogoutIcon />
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-500 hover:text-dark-700 dark:text-dark-300 dark:hover:text-dark-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={`${
                    pathname === link.href
                      ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-dark-500 hover:bg-dark-50 dark:hover:bg-dark-800 dark:text-dark-300'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium theme-transition`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </div>
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full text-left border-transparent text-dark-500 hover:bg-dark-50 dark:hover:bg-dark-800 dark:text-dark-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium theme-transition"
                >
                  <div className="flex items-center">
                    <span className="mr-2"><LogoutIcon /></span>
                    Logout
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 