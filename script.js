/* =========================================================
   script.js
   Interactive features for Mariam Yasser's CV webpage
   (Design of Web-Based Systems — Assignment 2)

   Implements:
   1. Welcome message on page load
   2. Dark mode / light mode toggle (persisted with localStorage)
   3. Show/Hide toggle for the Experience, Skills, and
      Certifications sections
   4. Dynamic skills list (add a new skill on the fly)
   5. Contact form with client-side validation
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initWelcomeMessage();
  initThemeToggle();
  initSectionToggles();
  initDynamicSkills();
  initContactForm();
});

/* ---------------------------------------------------------
   1. Welcome message
   Shows a small toast in the corner when the page finishes
   loading, then fades it out automatically. Also dismissible
   by clicking it.
--------------------------------------------------------- */
function initWelcomeMessage() {
  var toast = document.getElementById("welcomeToast");
  if (!toast) return;

  toast.textContent = "Welcome to my portfolio page! 👋";
  toast.classList.add("show");

  var hide = function () {
    toast.classList.remove("show");
  };

  // Auto-dismiss after 4 seconds
  var autoHideTimer = setTimeout(hide, 4000);

  // Also let the user dismiss it early by clicking it
  toast.addEventListener("click", function () {
    clearTimeout(autoHideTimer);
    hide();
  });
}

/* ---------------------------------------------------------
   2. Dark mode / light mode toggle
   Toggles a data-theme attribute on <body> that the CSS
   reads, and remembers the choice in localStorage so it
   persists across visits.
--------------------------------------------------------- */
function initThemeToggle() {
  var toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  var body = document.body;
  var STORAGE_KEY = "cv-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      body.setAttribute("data-theme", "dark");
      toggleBtn.textContent = "☀️ Light mode";
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      body.removeAttribute("data-theme");
      toggleBtn.textContent = "🌙 Dark mode";
      toggleBtn.setAttribute("aria-pressed", "false");
    }
  }

  // Restore the saved preference, if any
  var savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) applyTheme(savedTheme);

  toggleBtn.addEventListener("click", function () {
    var isDark = body.getAttribute("data-theme") === "dark";
    var nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  });
}

/* ---------------------------------------------------------
   3. Show/Hide sections
   Any button with class="toggle-btn" and a data-target
   attribute toggles the visibility of the element with that
   id, and updates its own label + aria-expanded state.
--------------------------------------------------------- */
function initSectionToggles() {
  var buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var target = document.getElementById(targetId);
      if (!target) return;

      var isCollapsed = target.classList.toggle("collapsed");

      if (isCollapsed) {
        btn.textContent = "Show";
        btn.setAttribute("aria-expanded", "false");
      } else {
        btn.textContent = "Hide";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------------------------------------------------------
   4. Dynamic skills list
   Lets the user type a new skill and add it straight into
   the "Analytical & Technical" skills list without reloading
   the page.
--------------------------------------------------------- */
function initDynamicSkills() {
  var form = document.getElementById("addSkillForm");
  var input = document.getElementById("newSkillInput");
  var list = document.getElementById("skillsList");
  if (!form || !input || !list) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the form from reloading the page

    var newSkill = input.value.trim();
    if (newSkill === "") {
      input.focus();
      return;
    }

    var li = document.createElement("li");
    li.textContent = newSkill;
    li.classList.add("skill-added"); // small pop-in animation
    list.appendChild(li);

    input.value = "";
    input.focus();
  });
}

/* ---------------------------------------------------------
   5. Contact form with validation
   Validates required fields and email format, then shows a
   success or error message without submitting to a server.
--------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var nameInput = document.getElementById("contactName");
  var emailInput = document.getElementById("contactEmail");
  var messageInput = document.getElementById("contactMessage");

  var nameError = document.getElementById("nameError");
  var emailError = document.getElementById("emailError");
  var messageError = document.getElementById("messageError");
  var status = document.getElementById("formStatus");

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.classList.add("invalid");
      errorEl.textContent = message;
    } else {
      input.classList.remove("invalid");
      errorEl.textContent = "";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // handle everything client-side

    var isValid = true;

    // Required: name
    if (nameInput.value.trim() === "") {
      setFieldError(nameInput, nameError, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError(nameInput, nameError, "");
    }

    // Required + format: email
    var emailValue = emailInput.value.trim();
    if (emailValue === "") {
      setFieldError(emailInput, emailError, "Please enter your email.");
      isValid = false;
    } else if (!EMAIL_PATTERN.test(emailValue)) {
      setFieldError(emailInput, emailError, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError(emailInput, emailError, "");
    }

    // Required: message
    if (messageInput.value.trim() === "") {
      setFieldError(messageInput, messageError, "Please enter a message.");
      isValid = false;
    } else {
      setFieldError(messageInput, messageError, "");
    }

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.className = "form-status error";
      return;
    }

    // Simulate a successful submission (no backend in this assignment)
    status.textContent = "Thanks! Your message has been sent.";
    status.className = "form-status success";
    form.reset();
  });
}
