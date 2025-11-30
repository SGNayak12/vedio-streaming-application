import React from "react";
import "./VideoSettings.css";

const VideoSettings = ({
  playbackRate,
  quality,
  onPlaybackRateChange,
  onQualityChange,
  onClose,
}) => {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualities = [
    { label: "Auto", value: "auto" },
    { label: "1080p", value: "1080p" },
    { label: "720p", value: "720p" },
    { label: "480p", value: "480p" },
    { label: "360p", value: "360p" },
    { label: "240p", value: "240p" },
  ];

  return (
    <div className="video-settings-overlay" onClick={onClose}>
      <div className="video-settings-menu" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          {/* Playback Speed */}
          <div className="settings-section">
            <label className="settings-label">Playback Speed</label>
            <div className="settings-options">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  className={`settings-option ${
                    playbackRate === rate ? "active" : ""
                  }`}
                  onClick={() => onPlaybackRateChange(rate)}
                >
                  {rate === 1 ? "Normal" : `${rate}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="settings-section">
            <label className="settings-label">Quality</label>
            <div className="settings-options">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  className={`settings-option ${
                    quality === q.value ? "active" : ""
                  }`}
                  onClick={() => onQualityChange(q.value)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSettings;

