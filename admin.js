import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    query, 
    orderBy 
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

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. DOM Elements
const loginSection = document.getElementById('loginSection');
const adminContent = document.getElementById('adminContent');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const tableBody = document.getElementById('adminTableBody');
const countSpan = document.getElementById('count');

// 4. Credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin@123";

// --- LOGIN LOGIC ---
loginBtn.onclick = () => {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem("isAdminLoggedIn", "true");
        checkAuth();
    } else {
        alert("Invalid credentials. Access denied.");
    }
};

// --- LOGOUT LOGIC ---
logoutBtn.onclick = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    location.reload(); 
};

// --- AUTH CHECK ---
function checkAuth() {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        loginSection.style.display = "none";
        adminContent.style.display = "block";
        initRealTimeUpdate();
    } else {
        loginSection.style.display = "block";
        adminContent.style.display = "none";
    }
}

// --- REAL-TIME UPDATER ---
function initRealTimeUpdate() {
    // Show temporary loading indicator
    tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 20px;">Synchronizing with live database...</td></tr>';

    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    // onSnapshot replaces the "AJAX" call to keep the connection open
    onSnapshot(q, (snapshot) => {
        updateTableUI(snapshot);
    }, (error) => {
        console.error("Listener failed:", error);
        tableBody.innerHTML = '<tr><td colspan="2" style="color:red; text-align:center;">Connection Error.</td></tr>';
    });
}

// --- UI RENDERING ---
function updateTableUI(snapshot) {
    tableBody.innerHTML = '';
    countSpan.innerText = snapshot.size;

    if (snapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 20px;">No students enrolled yet.</td></tr>';
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Format the date or show "Pending" if the server timestamp hasn't arrived yet
        const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : "Processing...";
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600; color: #1a202c;">${data.displayName}</td>
            <td style="color: #718096; font-size: 0.9rem;">${date}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Start the check on load
checkAuth();
