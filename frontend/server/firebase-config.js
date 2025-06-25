// server/firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // From Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
