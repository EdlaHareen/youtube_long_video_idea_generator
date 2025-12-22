export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-title">Analyzing competitor videos...</h2>
      <p className="loading-subtitle">This may take 5-10 minutes. Please don't close this page.</p>
      <p className="loading-note">Our AI is analyzing videos, generating outlines, and creating personalized ideas for you.</p>
    </div>
  );
}
