import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyA-ray5X_S7FGcD1NeLBVuZAjVs1MvZgws",
  authDomain: "vacation-house-booking.firebaseapp.com",
  projectId: "vacation-house-booking",
  storageBucket: "vacation-house-booking.appspot.com",
  messagingSenderId: "125729392306",
  appId: "1:125729392306:web:ce94687f0285049d3aebab"
};

const firebaseApp = initializeApp(firebaseConfig)

export const database = getFirestore(firebaseApp)
