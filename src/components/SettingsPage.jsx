import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPreferences, saveUserPreferences } from '../utils/userData';

export default function SettingsPage({ onBack }) {
  const { user } = useAuth();
  const [defaultFilter, setDefaultFilter] = useState('all');
  const [defaultSort, setDefaultSort] = useState('default');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (user) {
      try {
        const preferences = await getUserPreferences(user.id);
        if (preferences) {
          if (preferences.defaultFilter) setDefaultFilter(preferences.defaultFilter);
          if (preferences.defaultSort) setDefaultSort(preferences.defaultSort);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        await saveUserPreferences(user.id, {
          defaultFilter,
          defaultSort,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400">Manage your preferences</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Default Filter
          </label>
          <select
            value={defaultFilter}
            onChange={(e) => setDefaultFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900"
          >
            <option value="all">All Videos</option>
            <option value="high-views">High Views (1000+)</option>
            <option value="medium-views">Medium Views (100-999)</option>
            <option value="low-views">Low Views (&lt;100)</option>
            <option value="high-likes">High Likes (50+)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Default Sort
          </label>
          <select
            value={defaultSort}
            onChange={(e) => setDefaultSort(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-900"
          >
            <option value="default">Default Order</option>
            <option value="views-desc">Views (High to Low)</option>
            <option value="views-asc">Views (Low to High)</option>
            <option value="likes-desc">Likes (High to Low)</option>
            <option value="likes-asc">Likes (Low to High)</option>
            <option value="channel-asc">Channel (A to Z)</option>
            <option value="channel-desc">Channel (Z to A)</option>
          </select>
        </div>

        <motion.button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
}


