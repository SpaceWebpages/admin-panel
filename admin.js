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
const tableBody = document.getElementById('adminTableBody');
const countSpan = document.getElementById('count');

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
    location.reload(); 
};

// --- AUTH CHECK ---
function checkAuth() {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        loginSection.style.display = "none";
        adminContent.style.display = "block";
        fetchDataAjaxStyle(); // Trigger the "AJAX" fetch
    } else {
        loginSection.style.display = "block";
        adminContent.style.display = "none";
    }
}

// --- AJAX-STYLE DATA FETCHING ---
async function fetchDataAjaxStyle() {
    // Show a loading state in the table
    tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">Loading database records...</td></tr>';
    
    try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        
        // This is the "request" part
        const querySnapshot = await getDocs(q);
        
        // This is the "success" callback part
        handleDataSuccess(querySnapshot);
        
    } catch (error) {
        // This is the "error" callback part
        console.error("AJAX Error:", error);
        tableBody.innerHTML = '<tr><td colspan="2" style="color:red; text-align:center;">Failed to load data.</td></tr>';
    }
}

function handleDataSuccess(snapshot) {
    tableBody.innerHTML = '';
    countSpan.innerText = snapshot.size;

    if (snapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">No students registered yet.</td></tr>';
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : "N/A";
        
        // Construct the row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${data.displayName}</strong></td>
            <td>${date}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize page state
checkAuth();
