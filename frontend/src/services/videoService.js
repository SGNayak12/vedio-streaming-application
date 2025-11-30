import { API_BASE_URL } from '../utils/constants';

/**
 * Video service for API interactions
 */
class VideoService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Upload a video file
   * @param {File} file - Video file to upload
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
  async uploadVideo(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Handle immediate response - backend processes asynchronously
            // For now, we'll need to extract ID from the response or wait
            // The backend should ideally return the ID immediately
            resolve(response);
          } catch (error) {
            // If response is not JSON, might be an error message
            reject(new Error(xhr.responseText || 'Invalid response from server'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}/api/videos/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Get all videos
   * @returns {Promise} List of all videos
   */
  async getAllVideos() {
    try {
      const response = await fetch(`${this.baseURL}/api/videos`);
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  /**
   * Get video by ID
   * @param {string} videoId - Video ID
   * @returns {Promise} Video details
   */
  async getVideoById(videoId) {
    try {
      const response = await fetch(`${this.baseURL}/api/videos/${videoId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  /**
   * Get video stream URL
   * @param {string} videoId - Video ID
   * @param {string} videoUrl - Optional Cloudinary video URL
   * @returns {string} Video stream URL
   */
  getVideoStreamUrl(videoId, videoUrl = null) {
    // If videoUrl is provided (from Cloudinary), convert to HLS format
    if (videoUrl && videoUrl.includes('cloudinary.com')) {
      // Cloudinary provides HLS streaming - extract public_id and create HLS manifest
      const parts = videoUrl.split('/video/upload/');
      if (parts.length > 1) {
        const versionAndId = parts[1];
        // Remove version prefix if present (v123456/) and file extension
        const publicId = versionAndId.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
        // Create HLS manifest URL
        return `${parts[0]}/video/upload/sp_hls/${publicId}.m3u8`;
      }
      return videoUrl;
    }
    // Fallback to old format
    return `${this.baseURL}/uploads/courses/${videoId}/index.m3u8`;
  }

  /**
   * Get video thumbnail URL
   * @param {string} videoId - Video ID
   * @param {string} thumbnailUrl - Optional thumbnail URL
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(videoId, thumbnailUrl = null) {
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
    return `${this.baseURL}/uploads/courses/${videoId}/thumbnail.jpg`;
  }
}

export default new VideoService();

