import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {
  uploadVideoToCloudinary,
  generateThumbnail,
  saveVideoMetadata,
  getAllVideos,
  getVideoById,
  updateVideoStatus,
} from "../services/videoService.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/temp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only video files are allowed."), false);
    }
  },
});

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await getAllVideos();
    res.json({
      success: true,
      count: videos.length,
      videos: videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching videos",
      error: error.message,
    });
  }
});

// Get video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    res.json({
      success: true,
      video: video,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching video",
      error: error.message,
    });
  }
});

// Upload video
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const videoId = uuidv4();
  const videoPath = req.file.path;
  const originalFilename = req.file.originalname;
  const fileSize = req.file.size;

  try {
    // Upload to Cloudinary
    console.log("Uploading video to Cloudinary...");
    const uploadResult = await uploadVideoToCloudinary(videoPath, {
      public_id: `video-streaming/${videoId}`,
      resource_type: "video",
    });

    console.log("Cloudinary upload successful:", uploadResult.public_id);

    // Generate thumbnail
    const thumbnailUrl = await generateThumbnail(uploadResult.secure_url);

    // Save video metadata
    const videoData = {
      title: originalFilename.replace(/\.[^/.]+$/, ""), // Remove extension
      cloudinaryId: uploadResult.public_id,
      videoUrl: uploadResult.secure_url,
      thumbnailUrl: thumbnailUrl || "",
      duration: uploadResult.duration || 0,
      fileSize: fileSize,
      format: "hls", // Cloudinary provides HLS automatically
      status: "ready",
    };

    const savedVideo = await saveVideoMetadata(videoData);

    // Clean up temporary file
    fs.unlink(videoPath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.json({
      success: true,
      message: "Video uploaded successfully",
      video: {
        id: savedVideo._id || savedVideo.cloudinaryId,
        cloudinaryId: savedVideo.cloudinaryId,
        videoUrl: savedVideo.videoUrl,
        thumbnailUrl: savedVideo.thumbnailUrl,
        title: savedVideo.title,
        duration: savedVideo.duration,
        status: savedVideo.status,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up temp file on error
    if (fs.existsSync(videoPath)) {
      fs.unlink(videoPath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message,
    });
  }
});

export default router;

