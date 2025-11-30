// Video player constants
export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VIDEO_QUALITIES = [
  { label: "Auto", value: "auto" },
  { label: "1080p", value: "1080p" },
  { label: "720p", value: "720p" },
  { label: "480p", value: "480p" },
  { label: "360p", value: "360p" },
  { label: "240p", value: "240p" },
];

export const KEYBOARD_SHORTCUTS = {
  SPACE: " ",
  K: "k",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  M: "m",
  F: "f",
  P: "p",
};

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Video player default settings
export const DEFAULT_PLAYER_SETTINGS = {
  autoplay: false,
  controls: false,
  preload: "auto",
  responsive: true,
  fluid: true,
};

