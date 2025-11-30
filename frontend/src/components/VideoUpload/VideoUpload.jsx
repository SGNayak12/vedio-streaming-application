import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import videoService from "../../services/videoService";
import "./VideoUpload.css";

const VideoUpload = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const ACCEPTED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo", // .avi
  ];

  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes

  const validateFile = (file) => {
    // Check file type
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      const acceptedExtensions = ["mp4", "webm", "ogg", "mov", "avi"];
      throw new Error(
        `Invalid file type. Accepted formats: ${acceptedExtensions.join(", ")}`
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeGB = MAX_FILE_SIZE / (1024 * 1024 * 1024);
      throw new Error(`File size exceeds maximum limit of ${maxSizeGB}GB`);
    }

    // Check if file is empty
    if (file.size === 0) {
      throw new Error("File is empty");
    }

    return true;
  };

  const handleFileSelect = useCallback((file) => {
    try {
      validateFile(file);
      setSelectedFile(file);
      setUploadStatus(null);
      setErrorMessage("");
      setUploadProgress(0);
    } catch (error) {
      setErrorMessage(error.message);
      setUploadStatus("error");
      setSelectedFile(null);
      if (onUploadError) {
        onUploadError(error.message);
      }
    }
  }, [onUploadError]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus(null);
    setErrorMessage("");
    setUploadProgress(0);

    try {
      const response = await videoService.uploadVideo(
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadStatus("success");
      setUploadProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (error) {
      const errorMsg = error.message || "Upload failed. Please try again.";
      setErrorMessage(errorMsg);
      setUploadStatus("error");
      setUploadProgress(0);

      if (onUploadError) {
        onUploadError(errorMsg);
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onUploadSuccess, onUploadError]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    setErrorMessage("");
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="video-upload-container">
      <div className="upload-header">
        <h2>Upload Video</h2>
        <p>Select a video file to upload and convert to HLS format</p>
      </div>

      {!selectedFile && (
        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content">
            <svg
              className="upload-icon"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h3>Drag and drop your video here</h3>
            <p>or click to browse</p>
            <span className="file-formats">
              Supported formats: MP4, WebM, OGG, MOV, AVI (Max 2GB)
            </span>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="upload-file-info">
          <div className="file-details">
            <div className="file-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="file-info">
              <h4>{selectedFile.name}</h4>
              <p>{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>

          {errorMessage && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {isUploading && (
            <div className="upload-progress-container">
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="progress-text">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="success-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Upload successful! Video is being processed...</span>
            </div>
          )}

          <div className="upload-actions">
            {!isUploading && uploadStatus !== "success" && (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={isUploading}
                >
                  Choose Different File
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={isUploading || uploadStatus === "success"}
                >
                  Upload Video
                </button>
              </>
            )}
            {uploadStatus === "success" && (
              <button className="btn btn-primary" onClick={handleReset}>
                Upload Another Video
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_VIDEO_TYPES.join(",")}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

VideoUpload.propTypes = {
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
};

export default VideoUpload;

