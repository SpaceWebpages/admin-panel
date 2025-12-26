import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Use your SAME config from the main page
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
const tableBody = document.getElementById('adminTableBody');
const countSpan = document.getElementById('count');

async function loadAllData() {
    try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        tableBody.innerHTML = ''; // Clear existing
        countSpan.innerText = querySnapshot.size; // Show total count

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : "N/A";

            const row = `
                <tr>
                    <td>${data.displayName}</td>
                    <td>${date}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Load data immediately on page open
loadAllData();