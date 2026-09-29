const { admin } = require('../firebaseAdmin');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or malformed Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = { 
      uid: decodedToken.uid, 
      email: decodedToken.email 
    };
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error.code || error.message);
    
    // Explicitly handle expired tokens for the client to refresh
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token expired', code: 'auth/id-token-expired' });
    }

    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyFirebaseToken;
