import { useState, useEffect, useRef } from 'react';
import { Download, Filter, ArrowUpDown } from 'lucide-react';
import { exportToCSV, exportToMarkdown, exportToPDF } from '../utils/exporters';

export default function ResultsHeader({ count, onNewSearch, results, onFilterChange, onSortChange, currentFilter, currentSort }) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const handleExport = (format) => {
    const filename = `video-ideas-${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'csv':
        exportToCSV(results, filename);
        break;
      case 'markdown':
        exportToMarkdown(results, filename);
        break;
      case 'pdf':
        exportToPDF(results, filename);
        break;
    }
    setShowExportMenu(false);
  };

  return (
    <div className="results-header-container">
      <div className="results-header">
        <h2 className="results-title">📊 Found {count} Video Ideas</h2>
        <div className="results-actions">
          <div className="export-menu-wrapper" ref={exportMenuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="export-button"
              title="Export ideas"
            >
              <Download size={18} />
              Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={() => handleExport('csv')} className="export-option">
                  Export as CSV
                </button>
                <button onClick={() => handleExport('markdown')} className="export-option">
                  Export as Markdown
                </button>
                <button onClick={() => handleExport('pdf')} className="export-option">
                  Export as PDF
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-button ${showFilters ? 'active' : ''}`}
            title="Filter and sort"
          >
            <Filter size={18} />
            Filter
          </button>
          <button onClick={onNewSearch} className="new-search-button">
            New Search
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>
              <ArrowUpDown size={16} />
              Sort by:
            </label>
            <select 
              value={currentSort} 
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default</option>
              <option value="views-desc">Views (High to Low)</option>
              <option value="views-asc">Views (Low to High)</option>
              <option value="likes-desc">Likes (High to Low)</option>
              <option value="likes-asc">Likes (Low to High)</option>
              <option value="channel-asc">Channel (A-Z)</option>
              <option value="channel-desc">Channel (Z-A)</option>
            </select>
          </div>
          <div className="filter-group">
            <label>
              <Filter size={16} />
              Filter by:
            </label>
            <select 
              value={currentFilter} 
              onChange={(e) => onFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ideas</option>
              <option value="high-views">High Views (1000+)</option>
              <option value="medium-views">Medium Views (100-999)</option>
              <option value="low-views">Low Views (&lt;100)</option>
              <option value="high-likes">High Likes (50+)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
