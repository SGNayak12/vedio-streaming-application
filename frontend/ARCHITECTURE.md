# Frontend Architecture Documentation

## 📁 Project Structure

```
frontend/src/
├── components/           # Reusable UI components
│   └── VideoPlayer/     # Video player component and related files
│       ├── VideoPlayer.jsx
│       ├── VideoPlayer.css
│       ├── VideoControls.jsx
│       ├── VideoControls.css
│       ├── VideoSettings.jsx
│       ├── VideoSettings.css
│       └── index.js
├── pages/               # Page-level components
│   └── VideoPage.jsx
├── hooks/               # Custom React hooks
│   ├── useVideoPlayer.js
│   └── index.js
├── services/            # API and external service integrations
│   └── videoService.js
├── utils/               # Utility functions and constants
│   ├── formatTime.js
│   ├── constants.js
│   └── index.js
├── styles/              # Global and page-specific styles
│   ├── global.css
│   └── VideoPage.css
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Additional styles
```

## 🎯 Core Components

### VideoPlayer Component
The main video player component that wraps Video.js functionality.

**Features:**
- HLS streaming support
- Keyboard shortcuts
- Auto-hiding controls
- Loading states
- Fullscreen support
- Picture-in-picture support

**Props:**
- `src` (string): Video source URL
- `poster` (string, optional): Poster image URL
- `title` (string, optional): Video title
- `autoplay` (boolean, optional): Auto-play video
- `onReady` (function, optional): Callback when player is ready
- `onTimeUpdate` (function, optional): Callback on time update
- `onEnded` (function, optional): Callback when video ends

### VideoControls Component
Custom video controls overlay with full functionality.

**Features:**
- Play/pause button
- Progress bar with buffered ranges
- Volume control with slider
- Time display
- Fullscreen toggle
- Picture-in-picture toggle
- Settings menu trigger
- Hover tooltips on progress bar

### VideoSettings Component
Settings menu for video playback customization.

**Features:**
- Playback speed selection (0.25x to 2x)
- Quality selection (Auto, 1080p, 720p, 480p, 360p, 240p)
- Modal overlay design

## 🪝 Custom Hooks

### useVideoPlayer Hook
Manages all video player state and provides control functions.

**Returns:**
- Player state: `isPlaying`, `currentTime`, `duration`, `volume`, `playbackRate`, `quality`, `isMuted`, `isFullscreen`, `buffered`, `isLoading`
- Control functions: `handlePlayPause`, `handleSeek`, `handleVolumeChange`, `handleMute`, `handlePlaybackRateChange`, `handleQualityChange`, `handleFullscreen`, `handlePictureInPicture`

## 🎹 Keyboard Shortcuts

- **Space / K**: Play/Pause
- **Left Arrow**: Seek backward 10 seconds
- **Right Arrow**: Seek forward 10 seconds
- **Up Arrow**: Increase volume
- **Down Arrow**: Decrease volume
- **M**: Mute/Unmute
- **F**: Toggle fullscreen
- **P**: Toggle picture-in-picture

## 🎨 Styling

### CSS Architecture
- **Global styles**: Base styles, resets, and utility classes
- **Component styles**: Scoped CSS files for each component
- **Responsive design**: Mobile-first approach with media queries
- **Theme**: Modern gradient design with purple/blue color scheme

### Color Palette
- Primary: `#667eea` (Purple-blue)
- Secondary: `#764ba2` (Purple)
- Background: `#000` (Black)
- Text: `#fff` (White)
- Accents: Various opacity levels for overlays

## 🔧 Utilities

### formatTime.js
Utility functions for time formatting:
- `formatTime(seconds)`: Formats seconds to MM:SS or HH:MM:SS
- `parseTime(timeString)`: Parses time string to seconds

### constants.js
Application-wide constants:
- Playback rates
- Video qualities
- Keyboard shortcuts
- API configuration
- Default player settings

## 🌐 Services

### videoService.js
Service for video-related API calls:
- `uploadVideo(file, onProgress)`: Upload video with progress tracking
- `getVideoStreamUrl(videoId)`: Get HLS stream URL
- `getThumbnailUrl(videoId)`: Get thumbnail URL

## 📱 Responsive Design

The player is fully responsive and adapts to different screen sizes:
- Desktop: Full-featured controls and settings
- Tablet: Optimized layout with touch-friendly controls
- Mobile: Simplified controls, hidden non-essential elements

## 🚀 Features Implemented

✅ HLS video streaming
✅ Custom video controls
✅ Playback speed control (0.25x - 2x)
✅ Volume control with mute
✅ Fullscreen support
✅ Picture-in-picture support
✅ Keyboard shortcuts
✅ Loading states
✅ Buffered progress indication
✅ Auto-hiding controls
✅ Time tooltips on progress bar
✅ Settings menu
✅ Responsive design
✅ Smooth animations and transitions
✅ Accessibility features (ARIA labels, keyboard navigation)

## 🔮 Future Enhancements

- [ ] Subtitle/caption support
- [ ] Playlist functionality
- [ ] Video chapters
- [ ] Analytics tracking
- [ ] Playback position saving
- [ ] Quality auto-adjustment based on bandwidth
- [ ] Live streaming support
- [ ] Multi-audio track support
- [ ] Video annotations
- [ ] Social sharing

## 🛠️ Technology Stack

- **React 18**: UI library
- **Video.js 8**: Video player framework
- **Vite**: Build tool
- **CSS3**: Styling with modern features

## 📝 Development Notes

- All components use functional components with hooks
- State management is handled through custom hooks
- CSS modules or styled-components could be added for better scoping
- Error boundaries should be added for production
- Consider adding video analytics for usage tracking

