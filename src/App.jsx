import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsHeader from './components/ResultsHeader';
import ResultsGrid from './components/ResultsGrid';
import UserMenu from './components/UserMenu';
import FavoritesPage from './components/FavoritesPage';
import SettingsPage from './components/SettingsPage';
import { fetchVideoIdeas } from './utils/api';
import { useAuth } from './contexts/AuthContext';
import { saveSearchHistory, getUserPreferences, saveUserPreferences } from './utils/userData';

function App() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('default');
  const [lastSearch, setLastSearch] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['landing']);
  const resultsRef = useRef(null);

  // Load user preferences on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserPreferences();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  const loadUserPreferences = async () => {
    try {
      const preferences = await getUserPreferences(user.id);
      if (preferences) {
        if (preferences.defaultFilter) setCurrentFilter(preferences.defaultFilter);
        if (preferences.defaultSort) setCurrentSort(preferences.defaultSort);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSubmit = async (keyword, channelBrief) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setLastSearch({ keyword, channelBrief });

    try {
      const data = await fetchVideoIdeas(keyword, channelBrief);
      console.log('Received data from API:', data);
      console.log('Results array:', data.results);
      console.log('Results length:', data.results?.length);
      
      if (!data.results || !Array.isArray(data.results)) {
        console.error('Invalid results format:', data);
        throw new Error('Invalid response format: results is not an array');
      }

      if (data.results.length === 0) {
        console.warn('No results returned from API');
        setError('No video ideas were generated. Please try different keywords.');
        return;
      }

      setResults(data.results);
      navigateTo('results');

      // Save search history if authenticated
      if (isAuthenticated && user) {
        try {
          await saveSearchHistory(user.id, keyword, channelBrief, data.results);
        } catch (error) {
          console.error('Error saving search history:', error);
          // Don't fail the request if history save fails
        }
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save preferences when they change (debounced)
  useEffect(() => {
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        saveUserPreferences(user.id, {
          defaultFilter: currentFilter,
          defaultSort: currentSort,
        }).catch(error => {
          console.error('Error saving preferences:', error);
        });
      }, 1000); // Debounce by 1 second

      return () => clearTimeout(timer);
    }
  }, [currentFilter, currentSort, isAuthenticated, user]);

  const handleGetStarted = () => {
    setShowLanding(false);
    navigateTo('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    // Get the previous page from history
    const history = [...navigationHistory];
    history.pop(); // Remove current page
    const previousPage = history[history.length - 1] || 'landing';
    
    // Update history
    setNavigationHistory(history);
    
    // Navigate to previous page
    switch (previousPage) {
      case 'landing':
        setShowLanding(true);
        setResults(null);
        setError(null);
        setShowFavorites(false);
        setShowSettings(false);
        break;
      case 'form':
        setShowLanding(false);
        setResults(null);
        setError(null);
        setShowFavorites(false);
        setShowSettings(false);
        break;
      case 'results':
        setShowLanding(false);
        setShowFavorites(false);
        setShowSettings(false);
        // Keep results visible
        break;
      case 'favorites':
        setShowFavorites(true);
        setShowSettings(false);
        setResults(null);
        setError(null);
        break;
      case 'settings':
        setShowSettings(true);
        setShowFavorites(false);
        setResults(null);
        setError(null);
        break;
      default:
        setShowLanding(true);
        setResults(null);
        setError(null);
        setShowFavorites(false);
        setShowSettings(false);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page) => {
    setNavigationHistory([...navigationHistory, page]);
  };

  const handleNewSearch = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
  };

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    if (!results) return null;

    let filtered = [...results];

    // Apply filter
    switch (currentFilter) {
      case 'high-views':
        filtered = filtered.filter(v => v.viewCount >= 1000);
        break;
      case 'medium-views':
        filtered = filtered.filter(v => v.viewCount >= 100 && v.viewCount < 1000);
        break;
      case 'low-views':
        filtered = filtered.filter(v => v.viewCount < 100);
        break;
      case 'high-likes':
        filtered = filtered.filter(v => v.likes >= 50);
        break;
      default:
        // 'all' - no filter
        break;
    }

    // Apply sort
    switch (currentSort) {
      case 'views-desc':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'views-asc':
        filtered.sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0));
        break;
      case 'likes-desc':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'likes-asc':
        filtered.sort((a, b) => (a.likes || 0) - (b.likes || 0));
        break;
      case 'channel-asc':
        filtered.sort((a, b) => (a.channelName || '').localeCompare(b.channelName || ''));
        break;
      case 'channel-desc':
        filtered.sort((a, b) => (b.channelName || '').localeCompare(a.channelName || ''));
        break;
      default:
        // 'default' - keep original order
        break;
    }

    return filtered;
  }, [results, currentFilter, currentSort]);

  // Show landing page immediately, don't wait for auth
  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted}
        onFavoritesClick={() => {
          navigateTo('favorites');
          setShowFavorites(true);
          setShowSettings(false);
          setResults(null);
          setError(null);
          setShowLanding(false);
        }}
        onSettingsClick={() => {
          navigateTo('settings');
          setShowSettings(true);
          setShowFavorites(false);
          setResults(null);
          setError(null);
          setShowLanding(false);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="font-bold text-xl">IdeaPilot</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
            <UserMenu 
              onFavoritesClick={() => {
                const currentPage = showFavorites ? 'favorites' : showSettings ? 'settings' : results ? 'results' : 'form';
                navigateTo('favorites');
                setShowFavorites(true);
                setShowSettings(false);
                setResults(null);
                setError(null);
              }}
              onSettingsClick={() => {
                const currentPage = showFavorites ? 'favorites' : showSettings ? 'settings' : results ? 'results' : 'form';
                navigateTo('settings');
                setShowSettings(true);
                setShowFavorites(false);
                setResults(null);
                setError(null);
              }}
            />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {showFavorites && (
            <FavoritesPage onBack={() => setShowFavorites(false)} />
          )}

          {showSettings && (
            <SettingsPage onBack={() => setShowSettings(false)} />
          )}

          {!showFavorites && !showSettings && !results && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Generate Viral YouTube Ideas
                </h1>
                <p className="text-gray-400 text-lg">
                  Enter your keyword and channel details to get started
                </p>
              </motion.div>
              <div className="form-container">
                <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </motion.div>
          )}

          {!showFavorites && !showSettings && isLoading && <LoadingSpinner />}

          {!showFavorites && !showSettings && error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-container"
            >
              <div className="error-card">
                <h3 className="error-title">⚠️ Something went wrong</h3>
                <p className="error-message">{error}</p>
                <div className="error-actions">
                  <button onClick={handleRetry} className="retry-button">
                    Try Again
                  </button>
                  <button onClick={handleNewSearch} className="new-search-button">
                    New Search
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!showFavorites && !showSettings && results && !isLoading && (
            <div ref={resultsRef} className="results-section">
              <ResultsHeader
                count={filteredAndSortedResults?.length || results.length}
                onNewSearch={handleNewSearch}
                results={filteredAndSortedResults || results}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                currentFilter={currentFilter}
                currentSort={currentSort}
              />
              <ResultsGrid results={filteredAndSortedResults || results} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
