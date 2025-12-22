import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getFavorites } from '../utils/favorites';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from './VideoCard';

export default function FavoritesPage({ onBack }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setLoading(false);
      setError('Please sign in to view your favorites');
    }
  }, [user, isAuthenticated]);

  const loadFavorites = async () => {
    if (!user?.id) {
      setError('Please sign in to view your favorites');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const favs = await getFavorites(user.id);
      setFavorites(favs);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract video data from favorites - handle both old and new format
  const favoriteVideos = favorites.map(favorite => {
    // If favorite has video_data, use it, otherwise use the favorite object itself
    return favorite.video_data || favorite;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="favorites-page-container"
    >
      <div className="favorites-header-section">
        <h1 className="favorites-title">My Favorites</h1>
        <p className="favorites-subtitle">
          {favoriteVideos.length === 0 
            ? "You haven't favorited any videos yet" 
            : `${favoriteVideos.length} ${favoriteVideos.length === 1 ? 'favorite' : 'favorites'} saved`}
        </p>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <p className="text-gray-400">Loading favorites...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{error}</p>
        </motion.div>
      ) : favoriteVideos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3>No favorites yet</h3>
          <p className="text-gray-500">
            Start favoriting video ideas to see them here
          </p>
        </motion.div>
      ) : (
        <div className="results-grid">
          {favoriteVideos.map((video, index) => {
            const videoId = video.id || video.videoId || `favorite-${index}`;
            return (
              <VideoCard 
                key={videoId} 
                video={video}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

