import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, onSnapshot, query, orderBy, 
    doc, deleteDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Configuration
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

// 2. DOM Elements
const loginSection = document.getElementById('loginSection');
const adminContent = document.getElementById('adminContent');
const tableBody = document.getElementById('adminTableBody');
const countSpan = document.getElementById('count');

// 3. Admin Credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin@123";

// --- LOGIN LOGIC ---
document.getElementById('loginBtn').onclick = () => {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem("isAdminLoggedIn", "true");
        checkAuth();
    } else {
        alert("Access Denied: Incorrect Admin Credentials");
    }
};

document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    location.reload();
};

// --- AUTH CHECK ---
function checkAuth() {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        loginSection.style.display = "none";
        adminContent.style.display = "block";
        startLiveListener();
    }
}

// --- LIVE DATA LISTENER ---
function startLiveListener() {
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
                <td style="font-weight: 600;">${data.email || 'No Email'}</td>
                <td><code style="background: #f1f5f9; padding: 2px 5px; border-radius: 4px;">${data.password || '****'}</code></td>
                <td style="color: #64748b; font-size: 0.85rem;">${date}</td>
                <td style="text-align: right;">
                    <button class="btn-edit" onclick="handleEdit('${id}', '${data.email}', '${data.password}')">Edit</button>
                    <button class="btn-delete" onclick="handleDelete('${id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    });
}

// --- GLOBAL ACTIONS (Edit & Delete) ---
window.handleDelete = async (id) => {
    if (confirm("Permanently delete this entry?")) {
        try {
            await deleteDoc(doc(db, "users", id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }
};

window.handleEdit = async (id, currentEmail, currentPass) => {
    const newEmail = prompt("Edit Email:", currentEmail);
    const newPass = prompt("Edit Password:", currentPass);
    
    if (newEmail && newPass) {
        try {
            await updateDoc(doc(db, "users", id), {
                email: newEmail,
                password: newPass
            });
        } catch (err) {
            alert("Update failed. Check console.");
        }
    }
};

// Run auth check on load
checkAuth();
