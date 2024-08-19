// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB3vSWx1hy1rSu12B8K47BnL_ALazvETro",
    authDomain: "tpprofesionaljf.firebaseapp.com",
    projectId: "tpprofesionaljf",
    storageBucket: "tpprofesionaljf.appspot.com",
    messagingSenderId: "2468809902",
    appId: "1:2468809902:web:36343dd71536092f8f313f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
