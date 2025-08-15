// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const generateBtnText = document.getElementById("generateBtnText");
const generateBtnIcon = document.getElementById("generateBtnIcon");
const copyBtn = document.getElementById("copyBtn");
const copyBtnText = document.getElementById("copyBtnText");
const factText = document.getElementById("factText");
const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");

// API Configuration
const API_URL = "https://api.api-ninjas.com/v1/facts";
const API_KEY = "sWa7+GZ2kK7jOMmekt31Vg==P0mgODFiueMWZ3WQ";

// Theme Management
let currentTheme = localStorage.getItem("theme") || "light";

// Initialize the app
function init() {
  applyTheme(currentTheme);
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  generateBtn.addEventListener("click", fetchFact);
  copyBtn.addEventListener("click", copyFactToClipboard);
  themeBtn.addEventListener("click", toggleTheme);
}

// Fetch a random fact from the API
async function fetchFact() {
  try {
    // Show loading state inside button
    generateBtn.classList.add("loading");
    generateBtnText.textContent = "Generating...";
    generateBtnIcon.classList.add("hidden");

    const response = await fetch(API_URL, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      displayFact(data[0].fact);
    } else {
      throw new Error("No facts found in the response");
    }
  } catch (error) {
    console.error("Error fetching fact:", error);
    displayFact("Couldn't fetch a fact right now. Please try again later.");
  } finally {
    // Reset button state
    generateBtn.classList.remove("loading");
    generateBtnText.textContent = "Generate Fact";
    generateBtnIcon.classList.remove("hidden");
  }
}

// Display the fact on the page
function displayFact(fact) {
  factText.textContent = fact;
}

// Copy fact to clipboard with additional text
function copyFactToClipboard() {
  if (
    !factText.textContent ||
    factText.textContent.includes("Click the button")
  ) {
    return;
  }

  const textToCopy = `Fact of the day: ${factText.textContent}`;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // Update button temporarily
      copyBtnText.textContent = "Copied!";
      copyBtn.disabled = true;

      // Show toast
      toast.classList.remove("hidden");
      toast.classList.add("show");

      // Reset button after delay
      setTimeout(() => {
        copyBtnText.textContent = "Copy Fact";
        copyBtn.disabled = false;
      }, 2000);

      // Hide toast after delay
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 300);
      }, 3000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      copyBtnText.textContent = "Failed!";
      setTimeout(() => {
        copyBtnText.textContent = "Copy Fact";
      }, 2000);
    });
}

// Theme management functions
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
  updateThemeIcon();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = themeBtn.querySelector("i");
  if (currentTheme === "dark") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
