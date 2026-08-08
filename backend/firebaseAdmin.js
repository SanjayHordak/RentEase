const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

let db = null;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log('Firebase Admin Initialized successfully.');
  } else {
    console.warn('\n======================================================');
    console.warn('WARNING: serviceAccountKey.json not found in backend!');
    console.warn('Please generate a private key from Firebase Console');
    console.warn('and save it as backend/serviceAccountKey.json');
    console.warn('======================================================\n');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

module.exports = { admin, db };
