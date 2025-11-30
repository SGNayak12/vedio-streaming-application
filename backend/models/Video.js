import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    cloudinaryId: {
      type: String,
      required: true,
      unique: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: "hls",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "processing",
    },
    uploadedBy: {
      type: String,
      default: "anonymous",
    },
  },
  {
    timestamps: true,
  }
);

// If MongoDB is not available, use in-memory storage
let VideoModel;

try {
  VideoModel = mongoose.model("Video");
} catch {
  VideoModel = mongoose.model("Video", videoSchema);
}

// In-memory storage fallback
const inMemoryVideos = [];

export const Video = VideoModel;

// Fallback in-memory video storage functions
export const createVideoInMemory = (videoData) => {
  const video = {
    _id: videoData.cloudinaryId || Date.now().toString(),
    ...videoData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  inMemoryVideos.push(video);
  return video;
};

export const getAllVideosFromMemory = () => {
  return inMemoryVideos.sort((a, b) => b.createdAt - a.createdAt);
};

export const getVideoByIdFromMemory = (id) => {
  return inMemoryVideos.find((v) => v._id === id || v.cloudinaryId === id);
};

export default VideoModel;

