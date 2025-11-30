import { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";
import { useVideoPlayer } from "../../hooks/useVideoPlayer";
import VideoControls from "./VideoControls";
import VideoSettings from "./VideoSettings";

const VideoPlayer = ({ 
  src, 
  poster, 
  title,
  autoplay = false,
  onReady,
  onTimeUpdate,
  onEnded
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    quality,
    isMuted,
    isFullscreen,
    buffered,
    isLoading,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    handleMute,
    handlePlaybackRateChange,
    handleQualityChange,
    handleFullscreen,
    handlePictureInPicture
  } = useVideoPlayer(player, {
    onTimeUpdate,
    onEnded
  });

  // Initialize Video.js player - runs once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const videoJsOptions = {
        controls: false,
        responsive: true,
        fluid: true,
        autoplay: autoplay,
        preload: "auto",
        poster: poster || undefined,
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        html5: {
          vhs: {
            overrideNative: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
        sources: [
          {
            src: src,
            type: "application/x-mpegURL",
          },
        ],
      };

      const playerInstance = videojs(videoElement, videoJsOptions, () => {
        videojs.log("Player is ready");
        setPlayer(playerInstance);
        if (onReady) {
          onReady(playerInstance);
        }
      });

      playerRef.current = playerInstance;
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
        setPlayer(null);
      }
    };
  }, []); // Only run on mount/unmount

  // Update source when src changes
  useEffect(() => {
    if (player && src) {
      player.src({
        src: src,
        type: "application/x-mpegURL",
      });
    }
  }, [src, player]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeek(currentTime - 10);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeek(currentTime + 10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        case "m":
          e.preventDefault();
          handleMute();
          break;
        case "f":
          e.preventDefault();
          handleFullscreen();
          break;
        case "p":
          e.preventDefault();
          handlePictureInPicture();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePlayPause, handleSeek, currentTime, handleVolumeChange, volume, handleMute, handleFullscreen, handlePictureInPicture]);

  // Mouse movement handler for controls visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let controlsTimeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying]);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {title && (
        <div className="video-player-header">
          <h2>{title}</h2>
        </div>
      )}
      
      <div 
        className="video-player-wrapper"
        onDoubleClick={handleFullscreen}
      >
        <div 
          data-vjs-player 
          className="video-js-wrapper"
        >
          <div ref={videoRef} />
        </div>

        {showControls && (
          <>
            {isLoading && (
              <div className="video-loading-spinner">
                <div className="spinner"></div>
              </div>
            )}

            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              buffered={buffered}
              isLoading={isLoading}
              playbackRate={playbackRate}
              isFullscreen={isFullscreen}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onMute={handleMute}
              onFullscreen={handleFullscreen}
              onPictureInPicture={handlePictureInPicture}
              onSettingsClick={toggleSettings}
            />

            {isSettingsOpen && (
              <VideoSettings
                playbackRate={playbackRate}
                quality={quality}
                onPlaybackRateChange={handlePlaybackRateChange}
                onQualityChange={handleQualityChange}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  title: PropTypes.string,
  autoplay: PropTypes.bool,
  onReady: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onEnded: PropTypes.func,
};

export default VideoPlayer;
