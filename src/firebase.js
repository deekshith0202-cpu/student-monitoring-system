import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxbYffGbMtw37hlUR_RTkBzOMLlL2IEcw",
  authDomain: "study-monitoring-system-a5980.firebaseapp.com",
  databaseURL:
    "https://study-monitoring-system-a5980-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "study-monitoring-system-a5980",
  storageBucket: "study-monitoring-system-a5980.firebasestorage.app",
  messagingSenderId: "731231443313",
  appId: "1:731231443313:web:d57f487b6c9b89eb6f7ed0",
  measurementId: "G-NM3YWRB2SC"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };