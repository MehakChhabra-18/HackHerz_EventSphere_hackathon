// ===== POPUP ELEMENTS =====
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupDate = document.getElementById("popup-date");
const popupVenue = document.getElementById("popup-venue");
const closeBtn = document.querySelector(".close-btn");
const msg = document.getElementById("registerMsg");
const loginBtn = document.getElementById("login-btn");

// ===== EVENT DETAILS =====
const eventDetails = {
  "HACKFORGE": {
    img: "img/person-working-html-computer.jpg",
    description: "Turn your innovative ideas into working prototypes and showcase your coding skills!",
    date: "Nov 15–16, 2025",
    venue: "Tech Hall, Chitkara University"
  },
  "INSPIRE TALKS": {
    img: "img/corporate-businessman-giving-presentation-large-audience.jpg",
    description: "Get motivated by speakers from top industries and explore new horizons.",
    date: "Nov 22, 2025",
    venue: "Main Auditorium, Chitkara University"
  },
  "NIGHTPULSE": {
    img: "img/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space.jpg",
    description: "A vibrant DJ night filled with beats, lights, and high energy!",
    date: "Dec 5, 2025",
    venue: "Open Ground, Chitkara University"
  },
  "JOKE NIGHTS": {
    img: "img/35105922_8248639.jpg",
    description: "Laugh your heart out with stand-up performances from top comedians!",
    date: "Dec 10, 2025",
    venue: "Cultural Center, Chitkara University"
  }
};

// ===== Helpers =====
function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  } catch {
    return null;
  }
}

// ===== OPEN POPUP (pre-fill email if logged in but keep editable) =====
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const title = btn.closest(".card")?.querySelector("h2")?.textContent?.trim();
    const event = eventDetails[title];
    if (!event) return console.error("Event not found:", title);

    // Fill popup fields
    popupImg.src = event.img;
    popupTitle.textContent = title;
    popupDescription.textContent = event.description;
    popupDate.textContent = event.date;
    popupVenue.textContent = event.venue;
    msg.textContent = "";

    // Pre-fill email if logged in, but allow editing
    const regEmailInput = document.getElementById("regEmail");
    const loggedUser = getLoggedInUser();
    if (regEmailInput) {
      if (loggedUser && loggedUser.email) {
        regEmailInput.value = loggedUser.email;
      } else {
        regEmailInput.value = ""; // blank for manual entry
      }
    }

    popup.style.display = "flex";
  });
});

// ===== CLOSE POPUP =====
closeBtn.addEventListener("click", () => popup.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === popup) popup.style.display = "none"; });

// ===== REGISTRATION SUBMIT: any valid email allowed; save to JSON server; update admin table =====
document.addEventListener("submit", async (e) => {
  if (!e.target || e.target.id !== "eventRegisterForm") return;
  e.preventDefault();

  // Collect inputs
  const firstName = (document.getElementById("firstName")?.value || "").trim();
  const lastName = (document.getElementById("lastName")?.value || "").trim();
  const gender = (document.getElementById("gender")?.value || "").trim();
  const regEmail = (document.getElementById("regEmail")?.value || "").trim();
  const phone = (document.getElementById("phone")?.value || "").trim();
  const institution = (document.getElementById("institution")?.value || "").trim();
  const eventName = (document.getElementById("popup-title")?.textContent || "").trim();

  // Validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(regEmail)) {
    showMsg("⚠️ Enter a valid email address.", "orange");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    showMsg("⚠️ Enter a valid 10-digit phone number.", "orange");
    return;
  }
  if (!firstName || !lastName || !institution || !gender) {
    showMsg("⚠️ Please fill all required fields.", "orange");
    return;
  }

  const registration = {
    firstName,
    lastName,
    gender,
    email: regEmail,
    phone,
    institution,
    event: eventName,
    time: new Date().toLocaleString()
  };

  try {
    const res = await fetch("http://localhost:3000/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registration)
    });

    if (!res.ok) {
      showMsg("❌ Failed to register. Server returned " + res.status, "red");
      return;
    }

    // Success
    showMsg("✅ Registration Completed!", "limegreen");
    e.target.reset();

    // brief success alert and close popup
    setTimeout(() => {
      alert(`✅ Registration Completed!\n\nEvent: ${eventName}\nRegistered Email: ${regEmail}`);
      popup.style.display = "none";
    }, 600);

    // Update admin participants UI immediately (if admin page/table present)
    await refreshAdminParticipantsTable();
  } catch (err) {
    console.error("Registration error:", err);
    showMsg("❌ Server error. Make sure JSON Server is running.", "red");
  }
});

// ===== showMsg helper =====
function showMsg(text, color = "white") {
  if (!msg) return;
  msg.textContent = text;
  msg.style.color = color;
}

// ===== Admin participants: fetch and render table =====
async function fetchAllRegistrations() {
  try {
    const res = await fetch("http://localhost:3000/registrations");
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch registrations error:", err);
    return [];
  }
}

async function refreshAdminParticipantsTable() {
  const table = document.querySelector("#participants-table tbody");
  if (!table) return; // nothing to update on this page

  const regs = await fetchAllRegistrations();
  // Clear
  table.innerHTML = "";

  // Render rows newest-first
  regs.slice().reverse().forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml((r.firstName || "") + " " + (r.lastName || ""))}</td>
      <td>${escapeHtml(r.email || "")}</td>
      <td>${escapeHtml(r.phone || "")}</td>
      <td>${escapeHtml(r.gender || "")}</td>
      <td>${escapeHtml(r.event || "")}</td>
      <td>${escapeHtml(r.institution || "")}</td>
      <td>${escapeHtml(r.time || "")}</td>
    `;
    table.appendChild(tr);
  });
}

// small helper to avoid accidental HTML injection from fake values
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Optionally auto-refresh the admin table every 8s when admin page is open
let adminAutoRefreshInterval = null;
function startAdminAutoRefresh() {
  if (adminAutoRefreshInterval) clearInterval(adminAutoRefreshInterval);
  adminAutoRefreshInterval = setInterval(refreshAdminParticipantsTable, 8000);
}
function stopAdminAutoRefresh() {
  if (adminAutoRefreshInterval) clearInterval(adminAutoRefreshInterval);
  adminAutoRefreshInterval = null;
}

// Start auto-refresh only if participants table exists on page
if (document.querySelector("#participants-table")) {
  refreshAdminParticipantsTable();
  startAdminAutoRefresh();
}

// ===== Scroll button behavior (show events only on click) =====
const scrollBtn = document.querySelector(".scroll-btn");
if (scrollBtn) {
  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
      if (getComputedStyle(eventsSection).display === "none") {
        eventsSection.style.display = "flex";
      }
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ===== Login button behavior (unchanged) =====
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    if (isLoggedIn()) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUserId");
      localStorage.setItem("isLoggedIn", "false");
      updateLoginUIText();
    } else {
      window.location.href = "login.html";
    }
  });
}
function updateLoginUIText() {
  if (loginBtn) loginBtn.textContent = isLoggedIn() ? "Logout" : "Login";
}
updateLoginUIText();
