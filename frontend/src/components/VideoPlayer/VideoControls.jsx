import React, { useState, useRef, useEffect } from "react";
import "./VideoControls.css";

const VideoControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  buffered,
  isLoading,
  playbackRate,
  isFullscreen,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMute,
  onFullscreen,
  onPictureInPicture,
  onSettingsClick,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const progressBarRef = useRef(null);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getBufferedRanges = () => {
    if (!buffered || buffered.length === 0) return [];
    return Array.from({ length: buffered.length }, (_, i) => ({
      start: buffered.start(i),
      end: buffered.end(i),
    }));
  };

  const handleProgressMouseMove = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    setTooltipTime(time);
    setShowTooltip(true);
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const bufferedRanges = getBufferedRanges();

  return (
    <div className="video-controls">
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="progress-container"
        onClick={handleProgressClick}
        onMouseMove={handleProgressMouseMove}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="progress-bar">
          {/* Buffered ranges */}
          {bufferedRanges.map((range, index) => {
            const startPercent = (range.start / duration) * 100;
            const widthPercent = ((range.end - range.start) / duration) * 100;
            return (
              <div
                key={index}
                className="progress-buffered"
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
              />
            );
          })}

          {/* Current progress */}
          <div
            className="progress-current"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="progress-tooltip"
              style={{ left: `${(tooltipTime / duration) * 100}%` }}
            >
              {formatTime(tooltipTime)}
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="controls-bottom">
        <div className="controls-left">
          {/* Play/Pause Button */}
          <button
            className="control-btn"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume Control */}
          <div
            className="volume-control"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              className="control-btn"
              onClick={onMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            {showVolumeSlider && (
              <div className="volume-slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="volume-slider"
                />
              </div>
            )}
          </div>

          {/* Time Display */}
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="controls-right">
          {/* Playback Rate */}
          {playbackRate !== 1 && (
            <div className="playback-rate-display">
              {playbackRate}x
            </div>
          )}

          {/* Settings Button */}
          <button
            className="control-btn"
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>

          {/* Picture in Picture */}
          <button
            className="control-btn"
            onClick={onPictureInPicture}
            aria-label="Picture in Picture"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-8v6h8V7zm0-2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h8zM9 13H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM5 11h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2zm0-6h8c1.1 0 2 .9 2 2v2H7V7H5c-1.1 0-2-.9-2-2s.9-2 2-2zm14 0h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2v2h2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-2v2h2c1.1 0 2 .9 2 2s-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-2h-4v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2H9v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2H3v2c0 1.1-.9 2-2 2s-2-.9-2-2v-4c0-1.1.9-2 2-2h2v-2H3c-1.1 0-2-.9-2-2s.9-2 2-2h2V5c0-1.1.9-2 2-2s2 .9 2 2v2h4V5c0-1.1.9-2 2-2s2 .9 2 2v2h2z" />
            </svg>
          </button>

          {/* Fullscreen Button */}
          <button
            className="control-btn"
            onClick={onFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;

