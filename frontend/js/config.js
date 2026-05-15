const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000/api' 
    : 'https://rapid-rescue-backend.onrender.com/api'; // REPLACE THIS WITH YOUR RENDER BACKEND URL

// Export for module usage if needed, though we'll just include it via <script> tag
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
