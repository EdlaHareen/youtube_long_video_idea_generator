import { useState, useRef, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsHeader from './components/ResultsHeader';
import ResultsGrid from './components/ResultsGrid';
import { fetchVideoIdeas } from './utils/api';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  const handleSubmit = async (keyword, channelBrief) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await fetchVideoIdeas(keyword, channelBrief);
      setResults(data.results);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setShowLanding(true);
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewSearch = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setError(null);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="app">
      <header className="hero-header">
        <button onClick={handleBackToHome} className="back-button">
          ← Back to Home
        </button>
        <h1 className="hero-title">IdeaPilot</h1>
        <p className="hero-subtitle">
          Your AI co-pilot for YouTube success
        </p>
      </header>

      <main className="main-content">
        {!results && !isLoading && (
          <div className="form-container">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="error-container">
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
          </div>
        )}

        {results && !isLoading && (
          <div ref={resultsRef} className="results-section">
            <ResultsHeader
              count={results.length}
              onNewSearch={handleNewSearch}
            />
            <ResultsGrid results={results} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
