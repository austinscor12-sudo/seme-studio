// Importación modular de Firebase v11 (CDN oficial)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Pegá acá tu configuración de proyecto desde Firebase Console
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

let db = null;

try {
  if (firebaseConfig.apiKey !== "TU_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase conectado correctamente en SEME Studio.");
  }
} catch (error) {
  console.warn("Firebase en modo local (pendiente de credenciales):", error.message);
}

export async function registrarInteraccionDemo(servicioId, accion) {
  if (!db) return;
  try {
    await addDoc(collection(db, "interacciones_demos"), {
      servicioId,
      accion,
      fecha: serverTimestamp(),
      dispositivo: navigator.userAgent
    });
  } catch (err) {
    console.warn("No se pudo registrar métrica:", err.message);
  }
}