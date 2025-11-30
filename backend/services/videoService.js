import cloudinary from "../config/cloudinary.js";
import { Video, createVideoInMemory, getAllVideosFromMemory, getVideoByIdFromMemory } from "../models/Video.js";
import mongoose from "mongoose";

export const uploadVideoToCloudinary = async (filePath, options = {}) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "video-streaming/videos",
      eager: [
        { format: "mp4", quality: "auto" },
        { format: "webm", quality: "auto" },
      ],
      eager_async: true,
      ...options,
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload video to Cloudinary: ${error.message}`);
  }
};

export const generateThumbnail = async (videoUrl, options = {}) => {
  try {
    // Extract public_id from Cloudinary URL
    const publicIdMatch = videoUrl.match(/\/video\/upload\/(?:v\d+\/)?(.+)/);
    if (!publicIdMatch) {
      return null;
    }

    const publicId = publicIdMatch[1].replace(/\.[^/.]+$/, ""); // Remove file extension

    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 640, height: 360, crop: "fill" },
        { quality: "auto" },
      ],
      ...options,
    });

    return thumbnailUrl;
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return null;
  }
};

export const saveVideoMetadata = async (videoData) => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const video = new Video(videoData);
      await video.save();
      return video;
    } else {
      // Fallback to in-memory storage
      return createVideoInMemory(videoData);
    }
  } catch (error) {
    console.error("Error saving video metadata:", error);
    // Fallback to in-memory storage
    return createVideoInMemory(videoData);
  }
};

export const getAllVideos = async () => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const videos = await Video.find().sort({ createdAt: -1 });
      return videos;
    } else {
      // Fallback to in-memory storage
      return getAllVideosFromMemory();
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    // Fallback to in-memory storage
    return getAllVideosFromMemory();
  }
};

export const getVideoById = async (id) => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const video = await Video.findById(id);
      if (!video) {
        // Try finding by cloudinaryId
        return await Video.findOne({ cloudinaryId: id });
      }
      return video;
    } else {
      // Fallback to in-memory storage
      return getVideoByIdFromMemory(id);
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    return getVideoByIdFromMemory(id);
  }
};

export const updateVideoStatus = async (id, status, additionalData = {}) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const video = await Video.findOneAndUpdate(
        { $or: [{ _id: id }, { cloudinaryId: id }] },
        { status, ...additionalData },
        { new: true }
      );
      return video;
    } else {
      // Update in-memory storage
      const video = getVideoByIdFromMemory(id);
      if (video) {
        Object.assign(video, { status, ...additionalData, updatedAt: new Date() });
      }
      return video;
    }
  } catch (error) {
    console.error("Error updating video status:", error);
    return null;
  }
};

