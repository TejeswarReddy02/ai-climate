
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDkMSsPuDdOtnjkP_qERSV1_bDjs9NT5WA",
  authDomain: "login",
  projectId: "data",
  appId: "614411055564"
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// ✅ Create Auth and Google Provider instances only once
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Export them
export { auth, googleProvider };
