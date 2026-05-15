const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000/api' 
    : 'https://rapidrescue-xvy9.onrender.com/api';

// Export for module usage if needed, though we'll just include it via <script> tag
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
