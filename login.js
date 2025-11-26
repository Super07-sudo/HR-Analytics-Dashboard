// login.js — handles login validation & redirection

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  // Valid users
  const validUsers = {
    admin: "admin123",
    hr: "hr123"
  };

  if (validUsers[username] && validUsers[username] === password) {
    localStorage.setItem("loggedInUser", username);
    // Redirect to dashboard
    window.location.href = "index.html";
  } else {
    error.textContent = "❌ Invalid username or password.";
  }
}

// Auto redirect if already logged in
window.onload = function() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    window.location.href = "index.html";
  }
};
