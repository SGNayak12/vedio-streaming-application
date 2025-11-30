# Video Streaming Backend

Backend server for the video streaming application with Cloudinary integration.

## Features

- ✅ Video upload to Cloudinary
- ✅ Automatic thumbnail generation
- ✅ Video metadata storage (MongoDB or in-memory fallback)
- ✅ RESTful API endpoints
- ✅ File validation
- ✅ Error handling

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=8000
NODE_ENV=development

# Cloudinary Configuration (Required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB Configuration (Optional)
MONGODB_URI=mongodb://localhost:27017/video-streaming
```

### 3. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

### 4. Run the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Get All Videos
```
GET /api/videos
```

Response:
```json
{
  "success": true,
  "count": 2,
  "videos": [...]
}
```

### Get Video by ID
```
GET /api/videos/:id
```

### Upload Video
```
POST /api/videos/upload
Content-Type: multipart/form-data
Body: file (video file)
```

Response:
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "video": {
    "id": "...",
    "videoUrl": "...",
    "thumbnailUrl": "...",
    "title": "...",
    "status": "ready"
  }
}
```

## Storage Options

### Option 1: MongoDB (Recommended for Production)
- Install MongoDB
- Set `MONGODB_URI` in `.env`
- Videos metadata will be stored in MongoDB

### Option 2: In-Memory Storage (Default)
- No database setup required
- Videos metadata stored in memory
- Data is lost on server restart

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js    # Cloudinary configuration
│   └── database.js      # MongoDB connection
├── models/
│   └── Video.js         # Video schema/model
├── routes/
│   └── videoRoutes.js   # Video API routes
├── services/
│   └── videoService.js  # Video business logic
├── uploads/             # Temporary file storage
├── server.js            # Main server file
└── package.json
```

## Notes

- Videos are uploaded directly to Cloudinary
- Cloudinary automatically provides HLS streaming
- Thumbnails are auto-generated
- Temporary files are cleaned up after upload
- File size limit: 2GB

