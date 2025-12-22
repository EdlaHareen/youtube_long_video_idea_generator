import { Eye, ThumbsUp, Tv, Heart, X } from 'lucide-react';
import { formatNumber, formatOutline } from '../utils/formatters';
import { saveFavorite, removeFavorite, isFavorite } from '../utils/favorites';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function VideoCard({ video }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOutlineModal, setShowOutlineModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      checkFavorite();
    }
  }, [video.id, user?.id]);

  const checkFavorite = async () => {
    if (!user?.id) {
      setFavorited(false);
      return;
    }
    try {
      const isFav = await isFavorite(video.id, user.id);
      setFavorited(isFav);
    } catch (error) {
      console.error('Error checking favorite:', error);
      setFavorited(false);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.id) {
      alert('Please sign in to favorite videos');
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(video.id, user.id);
        setFavorited(false);
      } else {
        await saveFavorite(video, user.id);
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse newTitle if it's a JSON string
  const parseNewTitle = (newTitle) => {
    if (!newTitle) return { title: '', thumbnailText: '' };
    
    // If it's already an object, return it
    if (typeof newTitle === 'object') {
      return {
        title: newTitle.newTitle || newTitle.title || '',
        thumbnailText: newTitle.thumbnailText || newTitle.thumbnail_text || ''
      };
    }
    
    // If it's a string, clean it up and try to parse it as JSON
    if (typeof newTitle === 'string') {
      let cleaned = newTitle.trim();
      
      // Remove markdown code block markers (```json, ```, etc.)
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/g, '');
      
      // Try to extract JSON from the string if it contains JSON
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            title: parsed.newTitle || parsed.title || '',
            thumbnailText: parsed.thumbnailText || parsed.thumbnail_text || ''
          };
        } catch (e) {
          console.warn('Failed to parse JSON from newTitle:', e);
        }
      }
      
      // Check if the cleaned string itself is JSON
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        try {
          const parsed = JSON.parse(cleaned);
          return {
            title: parsed.newTitle || parsed.title || '',
            thumbnailText: parsed.thumbnailText || parsed.thumbnail_text || ''
          };
        } catch (e) {
          console.warn('Failed to parse cleaned JSON:', e);
        }
      }
      
      // If it's not JSON, treat it as a plain title
      return { title: cleaned, thumbnailText: '' };
    }
    
    return { title: '', thumbnailText: '' };
  };

  const { title: displayTitle, thumbnailText } = parseNewTitle(video.newTitle);
  
  // Debug logging (remove in production)
  if (video.newTitle && typeof video.newTitle === 'string' && video.newTitle.includes('{')) {
    console.log('Raw newTitle:', video.newTitle);
    console.log('Parsed result:', { displayTitle, thumbnailText });
  }

  return (
    <>
      <div className="video-card">
        <div className="thumbnail-container">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="thumbnail"
              onError={(e) => {
                console.error('Thumbnail failed to load:', video.thumbnailUrl);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="thumbnail-placeholder">
              <Tv size={48} className="text-gray-500" />
            </div>
          )}
          {user?.id && (
            <button
              onClick={handleFavorite}
              disabled={loading}
              className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                favorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          )}
          <div className="stats-overlay">
            <div className="stat">
              <Eye size={16} />
              <span>{formatNumber(video.viewCount)}</span>
            </div>
            <div className="stat">
              <ThumbsUp size={16} />
              <span>{formatNumber(video.likes)}</span>
            </div>
          </div>
        </div>

        <div className="card-content">
          <h3 className="original-title">{video.title}</h3>
          <div className="channel-name">
            <Tv size={16} />
            <span>{video.channelName}</span>
          </div>

          <div className="divider"></div>

          <div className="ai-section">
            <h4 className="ai-heading">💡 Your Unique Angle</h4>
            {displayTitle && (
              <p className="new-title">{displayTitle}</p>
            )}
            {thumbnailText && (
              <p className="thumbnail-text">{thumbnailText}</p>
            )}

            <button
              onClick={() => setShowOutlineModal(true)}
              className="outline-button"
            >
              📋 Full Outline
            </button>

            {/* Always show the button, but handle missing thumbnail in modal */}
            <button
              onClick={() => setShowThumbnailModal(true)}
              className="thumbnail-idea-button"
            >
              🎨 New Thumbnail Idea
            </button>
          </div>

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="watch-button"
          >
            Watch Original
          </a>
        </div>
      </div>

      {/* Outline Modal */}
      <AnimatePresence>
        {showOutlineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowOutlineModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="outline-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>📋 Full Outline</h2>
                <button
                  onClick={() => setShowOutlineModal(false)}
                  className="modal-close-button"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-content">
                <div className="outline-text">
                  <ReactMarkdown>{formatOutline(video.ideaContent)}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Modal */}
      <AnimatePresence>
        {showThumbnailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowThumbnailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="thumbnail-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>🎨 New Thumbnail Idea</h2>
                <button
                  onClick={() => setShowThumbnailModal(false)}
                  className="modal-close-button"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-content thumbnail-modal-content">
                {video.generatedThumbnailUrl ? (
                  <img
                    src={video.generatedThumbnailUrl}
                    alt="Generated thumbnail idea"
                    className="generated-thumbnail-image"
                    onError={(e) => {
                      console.error('Generated thumbnail failed to load:', video.generatedThumbnailUrl);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="thumbnail-placeholder-large" style={{ display: video.generatedThumbnailUrl ? 'none' : 'flex' }}>
                  <Tv size={64} className="text-gray-500" />
                  <p className="text-gray-400 mt-4">Thumbnail not available</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
