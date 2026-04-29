// ========================================
// THEME MANAGEMENT
// ========================================
const modeBtn = document.getElementById("modeBtn");
const THEME_KEY = "portfolio-theme";

// Define theme styles
const themes = {
  light: {
    bg: "#f8f9fa",
    color: "#212529",
    headerBg: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    cardBg: "#ffffff",
    primary: "#3498db",
    secondary: "#6c757d",
    buttonBg: "#3498db",
    buttonHover: "#2980b9",
  },
  dark: {
    bg: "#1a1a1a",
    color: "#e0e0e0",
    headerBg: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
    cardBg: "#2a2a2a",
    primary: "#64b5f6",
    secondary: "#b0bec5",
    buttonBg: "#64b5f6",
    buttonHover: "#42a5f5",
  },
};

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

// Apply theme to the document
function applyTheme(themeName) {
  const theme = themes[themeName];
  const isDark = themeName === "dark";

  document.documentElement.style.setProperty("--bg-color", theme.bg);
  document.documentElement.style.setProperty("--text-color", theme.color);
  document.documentElement.style.setProperty("--header-bg", theme.headerBg);
  document.documentElement.style.setProperty("--card-bg", theme.cardBg);
  document.documentElement.style.setProperty("--primary-color", theme.primary);
  document.documentElement.style.setProperty(
    "--secondary-color",
    theme.secondary,
  );
  document.documentElement.style.setProperty("--button-bg", theme.buttonBg);
  document.documentElement.style.setProperty(
    "--button-hover",
    theme.buttonHover,
  );

  document.body.style.background = theme.bg;
  document.body.style.color = theme.color;

  // Update button text
  modeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

  // Store preference
  localStorage.setItem(THEME_KEY, themeName);

  // Add transition class
  document.body.style.transition =
    "background-color 0.3s ease, color 0.3s ease";
}

// Toggle theme
modeBtn.addEventListener("click", () => {
  const currentTheme = localStorage.getItem(THEME_KEY) || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
});

// ========================================
// WEATHER FUNCTIONALITY
// ========================================
const weatherBtn = document.getElementById("weatherBtn");

async function getWeather() {
  try {
    // Using Open-Meteo API (free, no API key required)
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=62.8924&longitude=27.6770&current=temperature_2m,weather_code&timezone=auto",
    );

    if (!response.ok) throw new Error("Weather data unavailable");

    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const location = "Kuopio, Finland"; // Default location

    showWeatherModal(temp, location, data.current.weather_code);
  } catch (error) {
    showWeatherModal(null, "Location", null, error.message);
  }
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy with rime",
    51: "Light drizzle",
    61: "Slight rain",
    71: "Slight snow",
    80: "Slight rain showers",
    95: "Thunderstorm",
  };
  return weatherCodes[code] || "Unknown";
}

function showWeatherModal(temp, location, code, error = null) {
  // Remove existing modal if any
  const existing = document.getElementById("weatherModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "weatherModal";
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    text-align: center;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;

  if (error) {
    modal.innerHTML = `
      <h2 style="color: #e74c3c; margin-top: 0;">⚠️ Weather Unavailable</h2>
      <p style="color: #666;">${error}</p>
      <p style="color: #999; font-size: 14px;">Using Open-Meteo API (free weather service)</p>
      <button id="closeWeatherBtn" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 15px;">Close</button>
    `;
  } else if (temp !== null) {
    modal.innerHTML = `
      <h2 style="color: #2c3e50; margin-top: 0;">📍 ${location}</h2>
      <p style="font-size: 36px; color: #3498db; margin: 15px 0;">🌤️ ${temp}°C</p>
      <p style="color: #666; margin: 10px 0;">${getWeatherDescription(code)}</p>
      <button id="closeWeatherBtn" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 15px;">Close</button>
    `;
  }

  // Add overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Close handlers
  document.getElementById("closeWeatherBtn").addEventListener("click", () => {
    modal.remove();
    overlay.remove();
  });

  overlay.addEventListener("click", () => {
    modal.remove();
    overlay.remove();
  });
}

weatherBtn.addEventListener("click", getWeather);

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ========================================
// INTERSECTION OBSERVER (Fade-in animations)
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// ========================================
// SCROLL-TO-TOP BUTTON
// ========================================
function createScrollToTopBtn() {
  const scrollBtn = document.createElement("button");
  scrollBtn.id = "scrollTopBtn";
  scrollBtn.innerHTML = "↑ Top";
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #3498db;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: none;
    z-index: 100;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
    transition: background 0.3s ease;
  `;

  scrollBtn.addEventListener("mouseenter", () => {
    scrollBtn.style.background = "#2980b9";
  });

  scrollBtn.addEventListener("mouseleave", () => {
    scrollBtn.style.background = "#3498db";
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(scrollBtn);

  // Show/hide button on scroll
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "flex";
      scrollBtn.style.alignItems = "center";
      scrollBtn.style.justifyContent = "center";
    } else {
      scrollBtn.style.display = "none";
    }
  });
}

// ========================================
// LECTURE NAVIGATION
// ========================================

// Handle lecture card interactions
document.querySelectorAll(".lecture-card").forEach((card) => {
  // Preview link click
  const previewLink = card.querySelector(".preview-link");
  if (previewLink) {
    previewLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const previewUrl = card.dataset.preview;
      if (previewUrl) {
        window.open(previewUrl, "_blank");
      }
    });
  }

  // Card click (fallback to preview)
  card.addEventListener("click", (e) => {
    // Only trigger if clicking on the card itself, not on links
    if (
      e.target === card ||
      e.target.tagName === "H3" ||
      e.target.tagName === "P"
    ) {
      const previewUrl = card.dataset.preview;
      if (previewUrl) {
        window.open(previewUrl, "_blank");
      }
    }
  });
});

// ========================================
// INITIALIZE
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  createScrollToTopBtn();
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;
document.head.appendChild(style);
