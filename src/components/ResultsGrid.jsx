import VideoCard from './VideoCard';

export default function ResultsGrid({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="empty-state">
        <h3>No results found</h3>
        <p>Try adjusting your keywords or search terms</p>
      </div>
    );
  }

  return (
    <div className="results-grid">
      {results.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
