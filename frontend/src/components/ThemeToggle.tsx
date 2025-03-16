'use client';

import { useTheme } from '@/lib/theme';
import { motion } from 'framer-motion';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-100 focus:outline-none"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 180 : 0,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 0.5,
          type: 'spring',
          stiffness: 200,
        }}
      >
        {theme === 'dark' ? (
          <DarkModeIcon className="w-6 h-6 text-secondary-300" />
        ) : (
          <WbSunnyIcon className="w-6 h-6 text-warning-400" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 