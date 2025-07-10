const svg = document.getElementById('oakleyO');

// Zoom parameters
const minScale = 1;
const maxScale = 10;
const scrollStart = 0;
const scrollEnd = 1000;

function updateZoom() {
  const scrollY = window.scrollY;
  let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
  progress = Math.max(0, Math.min(progress, 1));
  const scale = minScale + (maxScale - minScale) * progress;
  svg.style.transform = `scale(${scale})`;
}

// Initial call to set scale and on scroll
window.addEventListener('scroll', updateZoom);
window.addEventListener('resize', updateZoom);
window.addEventListener('DOMContentLoaded', updateZoom);