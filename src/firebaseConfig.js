// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa o método getAuth
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa o método getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtHnVi3xOIAlgZMaT1YPmd29iFWpvsyUI",
  authDomain: "sprintify-47867.firebaseapp.com",
  projectId: "sprintify-47867",
  storageBucket: "sprintify-47867.appspot.com",
  messagingSenderId: "878089902443",
  appId: "1:878089902443:web:5d7a020779d1d65990542e",
  measurementId: "G-7K707MEXNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa o serviço de autenticação
const firestore = getFirestore(app); // Inicializa o Firestore
const analytics = getAnalytics(app);

export { auth, firestore }; // Exporta o serviço de autenticação e Firestore
export default app; // Exporta a aplicação
