import { Eye, ThumbsUp, Tv } from 'lucide-react';
import { formatNumber, formatOutline } from '../utils/formatters';

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <div className="thumbnail-container">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="thumbnail"
        />
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
          <p className="new-title">{video.newTitle}</p>

          <details className="outline-details">
            <summary className="outline-summary">📋 Full Outline</summary>
            <div className="outline-content">
              <pre>{formatOutline(video.ideaContent)}</pre>
            </div>
          </details>
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
  );
}
