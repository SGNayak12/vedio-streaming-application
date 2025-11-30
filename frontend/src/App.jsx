import { useState, useCallback } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import UploadPage from './pages/UploadPage';
import './styles/global.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleVideoUploaded = useCallback((videoId) => {
    // Refresh videos on home page after upload
    if (currentPage === 'home') {
      window.location.reload(); // Simple refresh, could be improved
    }
  }, [currentPage]);

  const handleVideoSelect = useCallback((videoId, video) => {
    setCurrentVideo({ id: videoId, ...video });
    setCurrentPage('video');
  }, []);

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'home' && (
        <HomePage onVideoSelect={handleVideoSelect} />
      )}
      {currentPage === 'upload' && (
        <UploadPage onVideoUploaded={handleVideoUploaded} />
      )}
      {currentPage === 'video' && (
        <VideoPage video={currentVideo} />
      )}
    </div>
  );
}

export default App;
