# Video Streaming Frontend

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   └── VideoPlayer/          # Video player components
│       ├── VideoPlayer.jsx   # Main player component
│       ├── VideoControls.jsx # Custom controls overlay
│       ├── VideoSettings.jsx # Settings menu
│       └── *.css            # Component styles
├── pages/
│   └── VideoPage.jsx        # Video page container
├── hooks/
│   └── useVideoPlayer.js    # Video player state hook
├── services/
│   └── videoService.js      # API service layer
├── utils/
│   ├── formatTime.js        # Time formatting utilities
│   └── constants.js         # App constants
└── styles/
    └── global.css           # Global styles
```

## 🎯 Features

### Video Player Features

✅ **HLS Streaming Support**
- Adaptive bitrate streaming
- Automatic quality adjustment

✅ **Advanced Controls**
- Play/Pause with keyboard shortcuts
- Seek with progress bar and buffered ranges
- Volume control with mute
- Fullscreen mode
- Picture-in-picture mode

✅ **Playback Options**
- Playback speed control (0.25x - 2x)
- Quality selection menu
- Settings overlay

✅ **User Experience**
- Auto-hiding controls
- Loading indicators
- Time tooltips on hover
- Keyboard shortcuts (Space/K, Arrows, M, F, P)
- Responsive design
- Smooth animations

✅ **Accessibility**
- ARIA labels
- Keyboard navigation
- Focus management

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `K` | Play/Pause |
| `←` | Seek backward 10s |
| `→` | Seek forward 10s |
| `↑` | Increase volume |
| `↓` | Decrease volume |
| `M` | Mute/Unmute |
| `F` | Toggle fullscreen |
| `P` | Picture-in-picture |

## 🎨 Customization

### Video Player Props

```jsx
<VideoPlayer
  src="http://localhost:8000/uploads/courses/video-id/index.m3u8"
  title="Video Title"
  poster="poster-image.jpg"
  autoplay={false}
  onReady={(player) => console.log('Player ready', player)}
  onTimeUpdate={(time) => console.log('Current time', time)}
  onEnded={() => console.log('Video ended')}
/>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📚 Documentation

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠️ Tech Stack

- **React 18** - UI library
- **Video.js 8** - Video player framework
- **Vite** - Build tool
- **CSS3** - Styling

## 📝 Development Notes

- All components use functional components with hooks
- State management handled through custom hooks
- Modular CSS architecture
- Mobile-first responsive design

## 🐛 Troubleshooting

### Player not loading
- Check that the HLS stream URL is correct
- Ensure backend server is running
- Check browser console for errors

### Controls not showing
- Move mouse over the player area
- Controls auto-hide after 3 seconds when playing

### Keyboard shortcuts not working
- Ensure focus is not on an input field
- Check browser console for JavaScript errors
