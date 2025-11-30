import { useState, useEffect, useCallback, useRef } from "react";

export const useVideoPlayer = (player, callbacks = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Set up player event listeners
  useEffect(() => {
    if (!player) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime());
      if (callbacksRef.current.onTimeUpdate) {
        callbacksRef.current.onTimeUpdate(player.currentTime());
      }
    };

    const handleDurationChange = () => {
      setDuration(player.duration());
    };

    const handleVolumeChange = () => {
      setVolume(player.volume());
      setIsMuted(player.muted());
    };

    const handleRateChange = () => {
      setPlaybackRate(player.playbackRate());
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleProgress = () => {
      setBuffered(player.buffered());
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (callbacksRef.current.onEnded) {
        callbacksRef.current.onEnded();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(player.isFullscreen());
    };

    // Initial values
    setIsPlaying(!player.paused());
    setCurrentTime(player.currentTime());
    setDuration(player.duration());
    setVolume(player.volume());
    setPlaybackRate(player.playbackRate());
    setIsMuted(player.muted());
    setIsFullscreen(player.isFullscreen());
    setBuffered(player.buffered());

    // Event listeners
    player.on("play", handlePlay);
    player.on("pause", handlePause);
    player.on("timeupdate", handleTimeUpdate);
    player.on("durationchange", handleDurationChange);
    player.on("volumechange", handleVolumeChange);
    player.on("ratechange", handleRateChange);
    player.on("waiting", handleWaiting);
    player.on("canplay", handleCanPlay);
    player.on("progress", handleProgress);
    player.on("ended", handleEnded);
    player.on("fullscreenchange", handleFullscreenChange);

    // Cleanup
    return () => {
      player.off("play", handlePlay);
      player.off("pause", handlePause);
      player.off("timeupdate", handleTimeUpdate);
      player.off("durationchange", handleDurationChange);
      player.off("volumechange", handleVolumeChange);
      player.off("ratechange", handleRateChange);
      player.off("waiting", handleWaiting);
      player.off("canplay", handleCanPlay);
      player.off("progress", handleProgress);
      player.off("ended", handleEnded);
      player.off("fullscreenchange", handleFullscreenChange);
    };
  }, [player]);

  const handlePlayPause = useCallback(() => {
    if (!player) return;
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  }, [player]);

  const handleSeek = useCallback((time) => {
    if (!player) return;
    const seekTime = Math.max(0, Math.min(time, duration));
    player.currentTime(seekTime);
    setCurrentTime(seekTime);
  }, [player, duration]);

  const handleVolumeChange = useCallback((newVolume) => {
    if (!player) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    player.volume(clampedVolume);
    setVolume(clampedVolume);
    if (clampedVolume > 0 && player.muted()) {
      player.muted(false);
      setIsMuted(false);
    }
  }, [player]);

  const handleMute = useCallback(() => {
    if (!player) return;
    player.muted(!player.muted());
    setIsMuted(player.muted());
  }, [player]);

  const handlePlaybackRateChange = useCallback((rate) => {
    if (!player) return;
    player.playbackRate(rate);
    setPlaybackRate(rate);
  }, [player]);

  const handleQualityChange = useCallback((newQuality) => {
    if (!player) return;
    setQuality(newQuality);
    
    // For HLS streams, quality changes are handled by the player automatically
    // This is a placeholder for future implementation
    // You might need to implement quality switching based on your stream setup
    console.log("Quality changed to:", newQuality);
  }, [player]);

  const handleFullscreen = useCallback(() => {
    if (!player) return;
    if (player.isFullscreen()) {
      player.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  }, [player]);

  const handlePictureInPicture = useCallback(() => {
    if (!player) return;
    if (player.isInPictureInPicture()) {
      player.exitPictureInPicture();
    } else {
      player.requestPictureInPicture();
    }
  }, [player]);

  return {
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
    handlePictureInPicture,
  };
};

