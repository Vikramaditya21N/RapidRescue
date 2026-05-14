const jwt = require('jsonwebtoken');

function requireAuthentication(request, response, next) {
  const authorizationHeader = request.headers['authorization'];
  
  if (!authorizationHeader) {
    return response.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  try {
    const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decodedTokenData;
    next();
  } catch (error) {
    return response.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = requireAuthentication;
