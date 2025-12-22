import VideoCard from './VideoCard';

export default function ResultsGrid({ results }) {
  console.log('ResultsGrid received:', results);
  console.log('Results length:', results?.length);
  console.log('First result:', results?.[0]);

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
      {results.map((video, index) => {
        // Ensure video has an id for the key
        const videoId = video.id || video.videoId || `video-${index}`;
        console.log(`Rendering video ${index}:`, videoId, video);
        return <VideoCard key={videoId} video={video} />;
      })}
    </div>
  );
}
