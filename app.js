const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const typed = document.querySelector("[data-typed]");
const roles = ["Web Developer", "AI/ML Learner", "IT Student"];
let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typed) return;
  const current = roles[roleIndex];
  typed.textContent = current.slice(0, letterIndex) + "|";

  if (!deleting && letterIndex < current.length) {
    letterIndex += 1;
    setTimeout(typeLoop, 92);
    return;
  }

  if (!deleting && letterIndex === current.length) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && letterIndex > 0) {
    letterIndex -= 1;
    setTimeout(typeLoop, 48);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeLoop, 220);
}

typeLoop();
