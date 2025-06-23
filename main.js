import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, update, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhduFMuWaND-XMkQiPGBCeaCgDgGSX-OQ",
  authDomain: "byby-sakra.firebaseapp.com",
  projectId: "byby-sakra",
  storageBucket: "byby-sakra.appspot.com",
  messagingSenderId: "329736043051",
  appId: "1:329736043051:web:ea3a4aa283744775a1086e",
  measurementId: "G-YB2TK0JEMS",
  databaseURL: "https://byby-sakra-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.register = async function() {
  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  if (!name || !phone) return alert("Ism va telefon raqamingizni kiriting!");

  const userId = Date.now();
  const time = new Date().toLocaleString("uz-UZ");

  await set(ref(db, "users/" + userId), {
    name,
    phone,
    score: 0,
    time
  });

  localStorage.setItem("username", name);
  localStorage.setItem("userId", userId);
  localStorage.setItem("phone", phone);

  location.href = "index.html";
}

export async function getLeaderboard() {
  const snapshot = await get(child(ref(db), 'users'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data).sort((a, b) => b.score - a.score);
  }
  return [];
}

export async function updateScore(score) {
  const id = localStorage.getItem("userId");
  if (!id) return;
  await update(ref(db, 'users/' + id), { score });
}
