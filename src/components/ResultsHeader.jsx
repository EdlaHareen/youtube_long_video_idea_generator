export default function ResultsHeader({ count, onNewSearch }) {
  return (
    <div className="results-header">
      <h2 className="results-title">📊 Found {count} Video Ideas</h2>
      <button onClick={onNewSearch} className="new-search-button">
        New Search
      </button>
    </div>
  );
}
