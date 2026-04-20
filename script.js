// LIGHT MODE TOGGLE
const modeBtn = document.getElementById("modeBtn");
let light = false;

modeBtn.addEventListener("click", () => {
  light = !light;

  if (light) {
    document.body.style.background = "#f5f5f5";
    document.body.style.color = "#111";
    modeBtn.textContent = "Dark Mode";
  } else {
    document.body.style.background = "#0d1f1e";
    document.body.style.color = "#f5f5f5";
    modeBtn.textContent = "Light Mode";
  }
});

// WEATHER BUTTON (placeholder)
document.getElementById("weatherBtn").addEventListener("click", () => {
  alert("Weather feature coming soon!");
});
