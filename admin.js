import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Credentials
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
        alert("Incorrect username or password!");
    }
};

// --- LOGOUT LOGIC ---
logoutBtn.onclick = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    location.reload(); // Refresh to show login screen
};

// --- AUTH CHECK ---
function checkAuth() {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        loginSection.style.display = "none";
        adminContent.style.display = "block";
        loadAllData();
    } else {
        loginSection.style.display = "block";
        adminContent.style.display = "none";
    }
}

// --- DATA FETCHING ---
async function loadAllData() {
    const tableBody = document.getElementById('adminTableBody');
    const countSpan = document.getElementById('count');
    
    try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        tableBody.innerHTML = '';
        countSpan.innerText = querySnapshot.size;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : "N/A";
            tableBody.innerHTML += `<tr><td>${data.displayName}</td><td>${date}</td></tr>`;
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Initialize page state
checkAuth();