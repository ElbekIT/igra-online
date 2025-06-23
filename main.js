import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
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
const storage = getStorage(app);

window.register = async function() {
  const name = document.getElementById("nameInput").value.trim();
  const file = document.getElementById("avatarInput").files[0];
  if (!name) return alert("Ismingizni kiriting!");
  if (!file) return alert("Avatar tanlang!");

  const userId = Date.now();
  const avatarRef = sRef(storage, `avatars/${userId}-${file.name}`);
  const snapshot = await uploadBytes(avatarRef, file);
  const avatarURL = await getDownloadURL(snapshot.ref);

  const time = new Date().toLocaleString("uz-UZ");
  await set(ref(db, "users/" + userId), {
    name,
    avatar: avatarURL,
    score: 0,
    time
  });

  localStorage.setItem("username", name);
  localStorage.setItem("userId", userId);
  localStorage.setItem("avatar", avatarURL);

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
