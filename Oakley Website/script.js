// ---- PASSWORD SCREEN ----
const PASSWORD = "2026"; // Change this password as needed

const overlay = document.getElementById('passwordOverlay');
const passwordBox = document.getElementById('passwordBox');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmit = document.getElementById('passwordSubmit');
const passwordError = document.getElementById('passwordError');
const protectedElements = [
  ...document.querySelectorAll('.logo-container, .controls, .spacer')
];

passwordBox.addEventListener('submit', function(e) {
  e.preventDefault();
  if (passwordInput.value === PASSWORD) {
    overlay.style.display = 'none';
    protectedElements.forEach(el => el.style.visibility = 'visible');
    // Optionally, clear the password field for security
    passwordInput.value = '';
    passwordError.textContent = '';
  } else {
    passwordError.textContent = "Incorrect password. Please try again.";
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// Allow pressing "Enter" to submit (already default), auto-focus
passwordInput.focus();

// ---- ZOOM/SLIDER CODE ----
window.addEventListener('DOMContentLoaded', function() {
  const svg = document.getElementById('oakleyO');
  const speedSlider = document.getElementById('scrollSpeed');
  const speedValue = document.getElementById('speedValue');
  const minScale = 1;
  const maxScale = 300;
  const scrollStart = 0;
  let scrollEnd = parseInt(speedSlider.value, 10);
  let currentScale = minScale;
  let targetScale = minScale;
  const easing = 0.08; // smaller = smoother

  function updateTargetScale() {
    const scrollY = window.scrollY;
    let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
    progress = Math.max(0, Math.min(progress, 1));
    targetScale = minScale + (maxScale - minScale) * progress;
  }

  function animate() {
    currentScale += (targetScale - currentScale) * easing;
    if (Math.abs(currentScale - targetScale) < 0.001) currentScale = targetScale;
    svg.style.transform = `scale(${currentScale})`;
    requestAnimationFrame(animate);
  }

  function updateSpeed() {
    scrollEnd = parseInt(speedSlider.value, 10);
    speedValue.textContent = scrollEnd;
    updateTargetScale();
  }

  window.addEventListener('scroll', updateTargetScale);
  window.addEventListener('resize', updateTargetScale);
  speedSlider.addEventListener('input', updateSpeed);

  // Initialize display and animation
  updateSpeed();
  animate();
});