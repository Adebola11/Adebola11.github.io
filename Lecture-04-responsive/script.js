/**
 * Lecture 04 - JavaScript Basics
 * Portfolio Page Interactions
 *
 * Features implemented:
 * A) Theme toggle (light/dark mode)
 * B) Click counter
 * C) Quick contact actions
 */

// ==========================================
// STATE VARIABLES (Requirement #4)
// ==========================================

// State: Track dark mode status
let isDarkMode = false;

// State: Track click count
let clickCount = 0;

// State: Track current language/theme preference
const userPreference = {
  theme: "light",
  lastVisit: new Date().toLocaleDateString(),
};

// ==========================================
// CONSOLE MESSAGES (Requirement #1)
// ==========================================

// Console log #1: Page loaded
console.log("✅ Page loaded successfully!");
console.log("📅 Current date:", userPreference.lastVisit);

// Console log #2: Variables initialized
console.log("📊 Initial state:", { isDarkMode, clickCount, userPreference });

// ==========================================
// FUNCTIONS (Requirement #2)
// ==========================================

/**
 * Function 1: Toggle between light and dark theme
 * Adds/removes 'dark-mode' class on body
 */
function toggleTheme() {
  const body = document.body;
  const themeBtn = document.getElementById("themeToggle");

  // Toggle state
  isDarkMode = !isDarkMode;

  // Apply/remove dark mode class
  if (isDarkMode) {
    body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
    userPreference.theme = "dark";
    console.log("🌙 Dark mode activated");
  } else {
    body.classList.remove("dark-mode");
    themeBtn.textContent = "🌙 Dark Mode";
    userPreference.theme = "light";
    console.log("☀️ Light mode activated");
  }

  // Console log #3: State change logged
  console.log("🔄 Theme toggled. Current state:", {
    isDarkMode,
    theme: userPreference.theme,
  });
}

/**
 * Function 2: Update greeting based on time of day
 */
function updateGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.getElementById("greeting");
  let greeting = "Welcome!";

  if (hour < 12) {
    greeting = "Good morning! ☀️";
  } else if (hour < 18) {
    greeting = "Good afternoon! 🌤️";
  } else {
    greeting = "Good evening! 🌙";
  }

  greetingElement.textContent = greeting;
  console.log("👋 Greeting updated:", greeting);
}

/**
 * Function 3: Increment and display click counter
 */
function incrementCounter() {
  clickCount++;

  // Update display
  const countDisplay = document.getElementById("clickCount");
  countDisplay.textContent = clickCount;

  // Log to console (as per requirements)
  console.log("🖱️ Button clicked! Count:", clickCount);

  // Optional: Change color based on count
  if (clickCount % 10 === 0) {
    console.log("🎉 Milestone reached:", clickCount, "clicks!");
    alert(`Wow! You've clicked ${clickCount} times!`);
  }
}

/**
 * Function 4: Show contact information
 */
function showContact(type) {
  const contactInfo = {
    email: "omofolarin.adebola@gmail.com",
    linkedin: "https://www.linkedin.com/in/adebola-omofolarin-1a5068178",
  };

  if (type === "email") {
    console.log("📧 Email requested:", contactInfo.email);
    alert(`📧 My Email:\n${contactInfo.email}\n\n(Copied to console)`);
  } else if (type === "linkedin") {
    console.log("💼 LinkedIn requested:", contactInfo.linkedin);
    alert(`💼 My LinkedIn:\n${contactInfo.linkedin}\n\nOpening in new tab...`);
    // Optional: Actually open it
    // window.open(contactInfo.linkedin, '_blank');
  }
}

// ==========================================
// EVENT HANDLERS (Requirement #3)
// ==========================================

// Event #1: Theme toggle button click
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM fully loaded and parsed");

  // Initialize greeting
  updateGreeting();

  // Theme toggle event
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
    console.log("✓ Theme toggle event listener attached");
  }

  // Event #2: Click counter button
  const clickBtn = document.getElementById("clickBtn");
  if (clickBtn) {
    clickBtn.addEventListener("click", incrementCounter);
    console.log("✓ Click counter event listener attached");
  }

  // Event #3: Email button
  const emailBtn = document.getElementById("emailBtn");
  if (emailBtn) {
    emailBtn.addEventListener("click", function () {
      showContact("email");
    });
    console.log("✓ Email button event listener attached");
  }

  // Event #4: LinkedIn button
  const linkedinBtn = document.getElementById("linkedinBtn");
  if (linkedinBtn) {
    linkedinBtn.addEventListener("click", function () {
      showContact("linkedin");
    });
    console.log("✓ LinkedIn button event listener attached");
  }

  // Final state log
  console.log("✅ All event listeners initialized");
  console.log("📊 Final initial state:", {
    isDarkMode,
    clickCount,
    userPreference,
  });
});
