import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu({ onFavoritesClick, onSettingsClick, onAdminClick }) {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleFavorites = () => {
    setIsOpen(false);
    if (onFavoritesClick) {
      onFavoritesClick();
    }
  };

  const handleSettings = () => {
    setIsOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleAdmin = () => {
    setIsOpen(false);
    if (onAdminClick) {
      onAdminClick();
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-medium">{user.email?.split('@')[0] || 'User'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
          >
            <div className="py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.email}</p>
              </div>
              
              <button
                onClick={handleFavorites}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>My Favorites</span>
              </button>

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>

              {isAdmin && (
                <>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={handleAdmin}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </button>
                </>
              )}

              <div className="border-t border-white/10 my-1" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
