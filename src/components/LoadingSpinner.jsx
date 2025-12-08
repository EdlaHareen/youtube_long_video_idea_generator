export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-title">Analyzing 50 competitor videos...</h2>
      <p className="loading-subtitle">This may take 2-3 minutes</p>
    </div>
  );
}
