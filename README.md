# Video Streaming Application

A full-stack video streaming application that allows users to upload and stream videos with adaptive quality. The application is built with modern web technologies and provides a smooth video playback experience.

## Features

- 🎥 Video upload functionality
- 📺 Video streaming with adaptive quality
- 🖥️ Modern responsive UI
- ⚡ Fast video processing
- 🔄 Real-time video format handling
- 📱 Cross-platform compatibility

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and development environment
- **Bun** - Package manager
- **CSS** - Styling

## Project Structure
```
├── frontend/                # Frontend React application
│   ├── src/                # Source files
│   │   ├── App.jsx        # Main application component
│   │   ├── VideoPlayer.jsx # Video player component
│   │   └── ...
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── uploads/               # Video storage directory
├── test-video/           # Test video files
├── index.js              # Backend server
└── package.json          # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js installed
- Bun installed (for frontend)

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install backend dependencies:
\`\`\`bash
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd frontend
bun install
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
npm start
# Server runs on http://localhost:3000
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd frontend
bun dev
# Frontend runs on http://localhost:5173
\`\`\`

## API Endpoints

### Video Upload
- **POST** `/upload`
  - Accepts multipart form data with 'file' field
  - Stores video in uploads directory
  - Returns unique identifier for the video

### Video Streaming
- **GET** `/uploads/:filename`
  - Streams video content
  - Supports partial content for seeking

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

