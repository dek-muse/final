// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL,ref} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBstNUnZ2L6UVPyW4j-TPiI41sjEJM-wmk",
  authDomain: "somalieduc.firebaseapp.com",
  projectId: "somalieduc",
  storageBucket: "somalieduc.appspot.com",
  messagingSenderId: "862528203599",
  appId: "1:862528203599:web:017ab7f7992fe90095b33a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
export const storage = getStorage(app);
export { getStorage ,getDownloadURL, ref };
