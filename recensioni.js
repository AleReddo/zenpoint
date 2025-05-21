
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB73RjQOWmUW7HXPizgf6jPriLbp08dYUQ",
  authDomain: "zenpoint-ba4cb.firebaseapp.com",
  projectId: "zenpoint-ba4cb",
  storageBucket: "zenpoint-ba4cb.firebasestorage.app",
  messagingSenderId: "807124402247",
  appId: "1:807124402247:web:f7909b4e57a5165424b162"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function signIn() {
  signInWithPopup(auth, provider).catch(error => alert(error.message));
}

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('review-form').style.display = 'block';
    document.getElementById('user-info').innerHTML = `<p>Benvenuto, ${user.displayName}</p>`;
  }
});

async function submitReview(id) {
  const user = auth.currentUser;
  if (!user) return alert("Devi accedere prima");
  const comment = document.getElementById("comment").value;
  const rating = parseInt(document.getElementById("rating").value);
  if (!comment) return alert("Scrivi qualcosa!");

  try {
    await addDoc(collection(db, "recensioni"), {
      professionistaId: id,
      nome: user.displayName,
      email: user.email,
      voto: rating,
      commento: comment,
      timestamp: serverTimestamp()
    });
    alert("Recensione inviata!");
    location.reload();
  } catch (e) {
    alert("Errore: " + e.message);
  }
}

async function loadReviews(id) {
  const reviewBox = document.getElementById("reviews");
  const q = query(collection(db, "recensioni"), where("professionistaId", "==", id));
  const docs = await getDocs(q);
  docs.forEach(doc => {
    const d = doc.data();
    const item = document.createElement("div");
    item.style = "border: 1px solid #ccc; padding: 1rem; margin: 1rem 0;";
    item.innerHTML = `<strong>${d.nome}</strong> (${d.voto} stelle)<br><p>${d.commento}</p>`;
    reviewBox.appendChild(item);
  });
}

window.signIn = signIn;
window.submitReview = submitReview;
window.loadReviews = loadReviews;
