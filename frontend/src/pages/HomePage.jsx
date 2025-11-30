import { useState, useEffect } from "react";
import videoService from "../services/videoService";
import "../styles/HomePage.css";

const HomePage = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await videoService.getAllVideos();
      setVideos(response.videos || []);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    // Extract video ID from Cloudinary URL or use the stored ID
    const videoId = video.id || video._id || video.cloudinaryId;
    
    if (onVideoSelect) {
      // Pass video object which contains videoUrl from Cloudinary
      onVideoSelect(videoId, video);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchVideos}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-page-container">
        <div className="home-header">
          <h1>All Videos</h1>
          <p>{videos.length} video{videos.length !== 1 ? "s" : ""} available</p>
        </div>

        {videos.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <h2>No videos yet</h2>
            <p>Upload your first video to get started!</p>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div
                key={video._id || video.id || video.cloudinaryId}
                className="video-card"
                onClick={() => handleVideoClick(video)}
              >
                <div className="video-thumbnail">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  {video.duration > 0 && (
                    <div className="video-duration-badge">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                  {video.status && (
                    <div className={`video-status-badge ${video.status}`}>
                      {video.status}
                    </div>
                  )}
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title || "Untitled Video"}</h3>
                  <div className="video-meta">
                    {video.fileSize > 0 && (
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {formatFileSize(video.fileSize)}
                      </span>
                    )}
                    {video.createdAt && (
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

