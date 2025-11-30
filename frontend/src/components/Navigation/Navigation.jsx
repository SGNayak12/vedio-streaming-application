import "./Navigation.css";

const Navigation = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>Video Streaming</h1>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === "upload" ? "active" : ""}`}
            onClick={() => onNavigate("upload")}
          >
            Upload Video
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

