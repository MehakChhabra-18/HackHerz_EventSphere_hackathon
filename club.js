// ----------------- LOGIN/LOGOUT (REMOVED/DISABLED) -----------------
// const loginBtn = document.getElementById("login-btn");
// function isLoggedIn() { return true; } // Always true for local testing
// function updateLoginUI() { loginBtn.textContent = "Join/Logout (Disabled)"; }

// loginBtn.addEventListener("click", () => {
//   alert("Login/Logout functionality disabled for this version.");
// });

// Note: If the login button exists in HTML, it will still display, 
// but clicking it will do nothing or show an alert, and the core form will open directly.

// ----------------- FILTER CLUBS -----------------
function filterClubs(category) {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterClubs(btn.dataset.category);
  });
});

// ----------------- CLUB EVENTS DATA (MOCK/LOCAL) -----------------
// Mock data is kept simple as only the join form is needed.
const clubEvents = { 
    // Data structures needed for utility functions (e.g. getUsersData)
};

// ----------------- DATA MANAGEMENT FUNCTIONS (MOCK/LOCAL) -----------------
// Mock functions to prevent crashes from missing server/JSON data
async function getUsersData() {
    return {
        clubs: [
            { id: 1, name: "Technical Club", coordinator: { name: "A. Singh", email: "a.singh@college.edu" } },
            { id: 9, name: "Art & Design Club", coordinator: { name: "I. Das", email: "i.das@college.edu" } },
            { id: 12, name: "Adventure Club", coordinator: { name: "L. Tiwari", email: "l.tiwari@college.edu" } },
            // Add other clubs here if needed for form submission logic
        ],
    };
}

async function mergeJoinRequests(userId) {
  // Always return empty array since login is skipped
  return [];
}

async function saveJoinRequestToServer(req) {
  // Since login is skipped, we only show success message without saving
  console.log("✅ Join request attempted (saving skipped as login is disabled).");
}

// ----------------- LEARN MORE MODAL (UNMODIFIED) -----------------
function createModal(title, description, imgSrc) {
  const existingModal = document.querySelector(".modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${title}</h2>
      <img src="${imgSrc}" alt="${title}">
      <p>${description}</p>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".close").onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

document.querySelectorAll(".card .learn-more").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const card = btn.closest(".card");
    const title = card.querySelector("h2").innerText;
    const description = card.querySelector("p").innerText;
    const imgSrc = card.querySelector("img").src;
    createModal(title, description, imgSrc);
  });
});

// ----------------- JOIN FORM FUNCTIONALITY (New Function) -----------------

// Function to create the modal content with the Join Form
function showJoinForm(modal, title, description, imgSrc) {
    const modalBody = modal.querySelector('.modal-body');
    // Using mock/empty data for name/email since login is skipped
    const email = 'N/A (Login Skipped)';
    const userName = '';

    const joinFormHTML = `
      <img src="${imgSrc}" alt="${title}">
      <p>${description}</p>
      
      <div class="join-form">
        <h3 style="color: #ffcc00; margin-bottom: 20px;">Join ${title}</h3>
        
        <div class="form-group">
          <label for="joinName">Full Name *</label>
          <input type="text" id="joinName" placeholder="Enter your full name" value="${userName}" required>
        </div>
        
        <div class="form-group">
          <label for="joinEmail">Email *</label>
          <input type="email" id="joinEmail" value="${email}" readonly>
        </div>
        
        <div class="form-group">
          <label for="joinPhone">Phone Number *</label>
          <input type="tel" id="joinPhone" placeholder="Enter your phone number" required>
        </div>
        
        <div class="form-group">
          <label for="joinYear">Year of Study *</label>
          <select id="joinYear" required>
            <option value="">-- Select Year --</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="joinDepartment">Department *</label>
          <input type="text" id="joinDepartment" placeholder="e.g., Computer Science" required>
        </div>
        
        <div class="form-group">
          <label for="joinReason">Why do you want to join this club? *</label>
          <textarea id="joinReason" rows="4" placeholder="Tell us about your interest and what you hope to gain..." required></textarea>
        </div>
        
        <div class="form-group">
          <label for="joinExperience">Relevant Experience (Optional)</label>
          <textarea id="joinExperience" rows="3" placeholder="Share any relevant skills or experience..."></textarea>
        </div>
        
        <div style="display:flex;gap:10px;margin-top:20px;justify-content:center;flex-wrap:wrap;">
          <button id="submitJoinBtn" class="btn action-btn">Submit Request</button>
          <button id="cancelJoinBtn" class="btn action-btn" style="background: linear-gradient(135deg, #666 0%, #444 100%);">Cancel</button>
        </div>
      </div>
    `;

    modalBody.innerHTML = joinFormHTML;

    // Handle form submission
    modal.querySelector('#submitJoinBtn').addEventListener('click', async () => {
        const name = modal.querySelector('#joinName').value.trim();
        const phone = modal.querySelector('#joinPhone').value.trim();
        const year = modal.querySelector('#joinYear').value;
        const department = modal.querySelector('#joinDepartment').value.trim();
        const reason = modal.querySelector('#joinReason').value.trim();
        const experience = modal.querySelector('#joinExperience').value.trim();

        // Validation
        if (!name || !phone || !year || !department || !reason) {
            return alert('Please fill in all required fields marked with *');
        }

        try {
            // Mock data for submission when login is skipped
            const userId = 0; // Use 0 for non-logged-in user
            const title = modal.querySelector('h3').innerText.replace('Join ', '').trim();
            const usersData = await getUsersData();
            const club = usersData.clubs?.find(c => c.name === title);
            const clubId = club?.id || null;

            const now = new Date();
            const req = {
                requestId: 'req_' + Date.now().toString(36),
                userId,
                userName: name,
                userEmail: email,
                clubId: clubId,
                clubName: title,
                phoneNumber: phone,
                yearOfStudy: year,
                department: department,
                reasonToJoin: reason,
                relevantExperience: experience || 'None',
                requestDate: now.toLocaleDateString(),
                requestTime: now.toLocaleTimeString(),
                status: 'pending',
            };

            await saveJoinRequestToServer(req);
            alert(`✅ Join request submitted successfully for ${title}!\n\nYour application is under review.\n\n(Note: This is mock submission; data is not saved or processed.)`);
            modal.remove();
        } catch (err) {
            console.error('Error submitting join request:', err);
            alert('Failed to submit request. Please try again.');
        }
    });

    // Handle cancel
    modal.querySelector('#cancelJoinBtn').addEventListener('click', () => {
        modal.remove();
    });
}

// ----------------- MODAL OPENER (SIMPLIFIED) -----------------

function openClubModal(card) {
  const title = card.querySelector('h2').innerText;
  const description = card.querySelector('p').innerText;
  const imgSrc = card.querySelector('img').src;

  const existing = document.querySelector('.modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Join ${title}</h2>
      <div class="modal-body">
                  </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Call the function to immediately show the Join Form content
  showJoinForm(modal, title, description, imgSrc);
 
  // Close behavior
  modal.querySelector('.close').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}


// Attach click behavior to open the form directly
document.querySelectorAll('.card .Events').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    
    const card = btn.closest('.card');
    openClubModal(card);
  });
});


// ----------------- SCROLL BUTTON -----------------
document.querySelector(".scroll-btn").addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#clubs").scrollIntoView({ behavior: "smooth" });
});


// ----------------- INITIALIZE -----------------
document.addEventListener("DOMContentLoaded", () => {
  filterClubs("all");
  // updateLoginUI(); // Removed to skip styling/checks
});