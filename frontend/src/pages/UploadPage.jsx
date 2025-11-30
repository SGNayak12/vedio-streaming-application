import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import VideoUpload from "../components/VideoUpload";
import "../styles/UploadPage.css";

const UploadPage = ({ onVideoUploaded }) => {
  const [uploadedVideoId, setUploadedVideoId] = useState(null);

  const handleUploadSuccess = useCallback(async (response) => {
    console.log("Upload successful:", response);
    
    // Extract video ID from response
    // New backend returns video object with id
    let videoId = null;
    
    if (response.video && response.video.id) {
      videoId = response.video.id;
    } else if (response.video && response.video.cloudinaryId) {
      videoId = response.video.cloudinaryId;
    } else if (response.id) {
      videoId = response.id;
    } else if (response.videoId) {
      videoId = response.videoId;
    }
    
    if (videoId) {
      setUploadedVideoId(videoId);
      
      // Call the callback to notify parent component
      if (onVideoUploaded) {
        onVideoUploaded(videoId);
      }
    } else {
      console.error("Could not extract video ID from response:", response);
      setUploadedVideoId("processing");
    }
  }, [onVideoUploaded]);

  const handleUploadError = useCallback((error) => {
    console.error("Upload error:", error);
  }, []);

  return (
    <div className="upload-page">
      <div className="upload-page-container">
        <VideoUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
        
        {uploadedVideoId && (
          <div className="upload-success-banner">
            <div className="success-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="success-title">Video uploaded successfully!</p>
                <p className="success-message">
                  {uploadedVideoId !== "processing" 
                    ? `Your video is being processed. Video ID: ${uploadedVideoId}`
                    : "Your video is being processed. Processing may take a few minutes."}
                </p>
                <p className="success-note">
                  Note: Video processing may take a few minutes depending on file size. You can navigate to the video player to watch once processing is complete.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UploadPage.propTypes = {
  onVideoUploaded: PropTypes.func,
};

export default UploadPage;
