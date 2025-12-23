import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Download, X, User, Eye, Search, Calendar } from 'lucide-react';
import { getAllFavorites, deleteFavorites, exportToCSV } from '../../utils/admin';

export default function AdminFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    let filtered = favorites;

    if (searchTerm) {
      filtered = filtered.filter(item => {
        const videoData = item.video_data || {};
        return (
          item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          videoData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          videoData.channelName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (startDate) {
      filtered = filtered.filter(item => new Date(item.created_at) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(item => new Date(item.created_at) <= new Date(endDate));
    }

    setFilteredFavorites(filtered);
  }, [searchTerm, startDate, endDate, favorites]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getAllFavorites();
      setFavorites(data);
      setFilteredFavorites(data);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredFavorites.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFavorites(selectedIds);
      await loadFavorites();
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting favorites:', err);
      alert('Failed to delete favorites: ' + err.message);
    }
  };

  const handleViewDetails = (favorite) => {
    setSelectedFavorite(favorite);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const exportData = filteredFavorites.map(item => {
      const videoData = item.video_data || {};
      return {
        'User Email': item.user?.email || 'Unknown',
        'Video Title': videoData.title || 'Unknown',
        'Channel': videoData.channelName || 'Unknown',
        'Views': videoData.viewCount || 0,
        'Likes': videoData.likes || 0,
        'Date Favorited': new Date(item.created_at).toLocaleString(),
      };
    });
    exportToCSV(exportData, 'favorites');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Favorites Management
          </h2>
          <p className="text-gray-400">View and manage all user favorites</p>
        </div>
        <motion.button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by user, title, or channel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <motion.button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Clear Filters
        </motion.button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-purple-300">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </motion.button>
        </motion.div>
      )}

      {/* Favorites Table */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredFavorites.length && filteredFavorites.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Video Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredFavorites.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No favorites found
                  </td>
                </tr>
              ) : (
                filteredFavorites.map((item) => {
                  const videoData = item.video_data || {};
                  return (
                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                          className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {item.user?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                        {videoData.title || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {videoData.channelName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          onClick={() => handleViewDetails(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-2">Delete Favorites</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete {selectedIds.length} favorite{selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedFavorite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Favorite Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">User</label>
                  <p className="text-white">{selectedFavorite.user?.email || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Video Title</label>
                  <p className="text-white">{selectedFavorite.video_data?.title || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Channel</label>
                  <p className="text-white">{selectedFavorite.video_data?.channelName || 'Unknown'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Views</label>
                    <p className="text-white">{selectedFavorite.video_data?.viewCount || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Likes</label>
                    <p className="text-white">{selectedFavorite.video_data?.likes || 0}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Date Favorited</label>
                  <p className="text-white">{new Date(selectedFavorite.created_at).toLocaleString()}</p>
                </div>
                {selectedFavorite.video_data?.url && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Video URL</label>
                    <a
                      href={selectedFavorite.video_data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 break-all"
                    >
                      {selectedFavorite.video_data.url}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

