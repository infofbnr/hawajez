// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHYnW3qaNo7oGKMPs9DFALdWXIeYv6ixY",
  authDomain: "gossip-38bf8.firebaseapp.com",
  projectId: "gossip-38bf8",
  storageBucket: "gossip-38bf8.firebasestorage.app",
  messagingSenderId: "224975261462",
  appId: "1:224975261462:web:f08fd243ec4a5c1a4a4a37",
  measurementId: "G-N7S9894R3N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get form and report list elements
const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const searchInput = document.getElementById("searchInput");

// Report form submission
if (reportForm) {
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const governorate = document.getElementById("governorate").value.trim();
    const locationDetail = document.getElementById("location").value.trim();
    const location = `${governorate} - ${locationDetail}`;
    const type = document.getElementById("type").value;
    const notes = document.getElementById("notes").value.trim();
    const timestamp = new Date();

    // Submit to Firestore
    await db.collection("reports").add({ location, type, notes, timestamp });
    alert("Report submitted!");
    window.location.href = "/";
  });
}

// Function to load reports
async function loadReports() {
  if (!reportsList) return;

  const querySnapshot = await db.collection("reports").orderBy("timestamp", "desc").get();
  const filter = searchInput ? searchInput.value.toLowerCase() : "";
  reportsList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const { location, type, notes, timestamp } = doc.data();
    if (!location.toLowerCase().includes(filter)) return;

    const timeString = timestamp.toDate().toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });

    const reportCard = `
      <div class="bg-white p-4 border rounded shadow-sm mb-4">
        <div class="font-semibold">${location}</div>
        <div class="text-sm text-gray-500">${type} - ${timeString}</div>
        ${notes ? `<p class="mt-2 text-sm">${notes}</p>` : ""}
      </div>
    `;
    reportsList.innerHTML += reportCard;
  });
}

// Load reports when page is ready
if (reportsList) {
  if (searchInput) searchInput.addEventListener("input", loadReports);
  loadReports();
}
