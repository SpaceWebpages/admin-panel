import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, onSnapshot, query, orderBy, 
    doc, deleteDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_JTCBKnJ7zaz8wRSiCpLRU2RcQZ2catw",
    authDomain: "my-firebase-site-a35bb.firebaseapp.com",
    projectId: "my-firebase-site-a35bb",
    storageBucket: "my-firebase-site-a35bb.firebasestorage.app",
    messagingSenderId: "943328160156",
    appId: "1:943328160156:web:9acc1c41989b21b3124059"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminContent = document.getElementById('adminContent');
const tableBody = document.getElementById('adminTableBody');
const countSpan = document.getElementById('count');

// Credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin@123";

// --- AUTH LOGIC ---
document.getElementById('loginBtn').onclick = () => {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem("isAdmin", "true");
        checkAuth();
    } else { alert("Wrong credentials!"); }
};

document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.removeItem("isAdmin");
    location.reload();
};

function checkAuth() {
    if (sessionStorage.getItem("isAdmin") === "true") {
        loginSection.style.display = "none";
        adminContent.style.display = "block";
        startLiveUpdate();
    }
}

// --- LIVE DATA & ACTIONS ---
function startLiveUpdate() {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        tableBody.innerHTML = '';
        countSpan.innerText = snapshot.size;

        snapshot.forEach((userDoc) => {
            const data = userDoc.data();
            const id = userDoc.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : "Syncing...";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${data.displayName}</strong></td>
                <td>${date}</td>
                <td style="text-align:right;">
                    <button class="btn-edit" onclick="handleEdit('${id}', '${data.displayName}')">Edit</button>
                    <button class="btn-delete" onclick="handleDelete('${id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    });
}

// Exposed to Global Window for HTML onclick access
window.handleDelete = async (id) => {
    if (confirm("Delete this student?")) {
        await deleteDoc(doc(db, "users", id));
    }
};

window.handleEdit = async (id, currentName) => {
    const newName = prompt("Enter new name:", currentName);
    if (newName && newName !== currentName) {
        await updateDoc(doc(db, "users", id), { displayName: newName });
    }
};

checkAuth();
