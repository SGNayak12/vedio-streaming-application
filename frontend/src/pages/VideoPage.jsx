import { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import VideoPlayer from "../components/VideoPlayer";
import videoService from "../services/videoService";
import "../styles/VideoPage.css";

const VideoPage = ({ video, videoId }) => {
  const playerRef = useRef(null);
  
  // Generate video URL from video object or videoId
  const videoLink = useMemo(() => {
    if (video && video.videoUrl) {
      // Use Cloudinary URL directly - Cloudinary provides HLS automatically
      // Convert to HLS format if needed
      let url = video.videoUrl;
      if (url.includes('cloudinary.com') && !url.includes('.m3u8')) {
        // Cloudinary auto-provides HLS, but we can request it explicitly
        // Extract public_id and create HLS manifest URL
        const parts = url.split('/video/upload/');
        if (parts.length > 1) {
          const versionAndId = parts[1];
          // Remove version prefix if present (v123456/)
          const publicId = versionAndId.replace(/^v\d+\//, '');
          // Create HLS URL
          url = `${parts[0]}/video/upload/sp_hls/${publicId}.m3u8`;
        }
      }
      return url;
    }
    // Fallback to old format
    const id = video?.id || video?._id || videoId || "104d2093-abb0-413b-8702-c3d70c8c7332";
    return videoService.getVideoStreamUrl(id);
  }, [video, videoId]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    console.log("Player is ready:", player);
  };

  const handleTimeUpdate = (currentTime) => {
    // You can add time tracking logic here
    // For example, save playback position, analytics, etc.
  };

  const handleVideoEnded = () => {
    console.log("Video ended");
    // You can add logic here like:
    // - Auto-play next video
    // - Show completion message
    // - Track analytics
  };

  return (
    <div className="video-page">
      <div className="video-page-container">
        <VideoPlayer
          src={videoLink}
          title={video?.title || "Video Player"}
          poster={video?.thumbnailUrl || null}
          autoplay={false}
          onReady={handlePlayerReady}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
        />
      </div>
    </div>
  );
};

VideoPage.propTypes = {
  video: PropTypes.object,
  videoId: PropTypes.string,
};

export default VideoPage;

