import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { config } from "./config";

// Initialize Firebase with centralized config
const app = !getApps().length ? initializeApp(config.firebase) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let analytics;

if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics, auth, googleProvider };
