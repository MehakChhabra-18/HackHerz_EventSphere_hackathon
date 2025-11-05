const apiURL = "http://localhost:3000/users"; // JSON Server endpoint

// Helper function for basic form validation
function validateForm(email, password, role) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Enter a valid email address (e.g. name@example.com)");
        return false;
    }
    if (password.length < 5) {
        alert("Password must be at least 5 characters long.");
        return false;
    }
    if (!role || role === "") {
        alert("Please select a valid role.");
        return false;
    }
    return true;
}

/* ----------------------------------
   ## 📝 Registration Logic (Sign Up)
   ---------------------------------- */
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const role = document.getElementById("role").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!validateForm(email, password, role)) return;

        try {
            // 1. Check if user already exists
            const checkRes = await fetch(`${apiURL}?email=${email}`);
            const existingUsers = await checkRes.json();

            if (existingUsers.length > 0) {
                alert("User already exists! Please log in.");
                return;
            }

            // 2. Register new user (POST request)
            await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, email, password })
            });

            alert("Registration successful! Please login.");
            window.location.href = "login.html"; // Redirect to login page
        } catch (err) {
            console.error("Registration error:", err);
            // This error usually means the JSON Server is not running
            alert("Error during registration. Make sure JSON Server is running."); 
        }
    });
}

/* --------------------------------
   ## 🔑 Login Logic (Sign In)
   -------------------------------- */
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const role = document.getElementById("role").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!validateForm(email, password, role)) return;

        try {
            // 1. Query JSON Server for a user matching ALL fields (email, password, and role)
            const res = await fetch(`${apiURL}?email=${email}&password=${password}&role=${role}`);
            const users = await res.json();

            if (users.length === 1) {
                const user = users[0];
                alert(`Login successful! Welcome, ${user.role}!`);

                // Optional: Save logged-in user details to localStorage
                localStorage.setItem("loggedInUser", JSON.stringify(user)); 

                // FIX: Use setTimeout for graceful redirection after the alert closes
                setTimeout(() => {
                    // 2. Redirect based on role
                    if (role === "participant") {
                        window.location.href = "home.html";
                    } else if (role === "judge") {
                        window.location.href = "judge_dashboard.html";
                    } else if (role === "admin") {
                        window.location.href = "admin_dashboard.html";
                    }
                }, 100); 

            } else {
                // Login failed: Incorrect email, password, or role for the registered user
                alert("Invalid email, password, or role. Please check your details or register first.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Error connecting to the server. Make sure JSON Server is running.");
        }
    });
}