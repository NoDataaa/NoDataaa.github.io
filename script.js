import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/loaders/OBJLoader.js';

const PIN = "2026";

window.checkPIN = function () {
  const pin = document.getElementById("pin-input").value;
  if (pin === PIN) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("viewer-container").style.display = "block";
    initViewer();
  } else {
    document.getElementById("error-message").innerText = "Incorrect PIN. Try again.";
  }
};

let scene, camera, renderer, controls;

function initViewer() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(45, 640 / 480, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("glcanvas"), antialias: true });
  renderer.setSize(640, 480);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  animate();
  setupDragAndDrop();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function setupDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(0,0,0,0.2)';
  });
  window.addEventListener('dragleave', (e) => {
    dropZone.style.background = 'rgba(0,0,0,0.05)';
  });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(0,0,0,0.05)';

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.obj')) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const contents = event.target.result;
        loadOBJModel(contents);
      };
      reader.readAsText(file);
    }
  });
}

function loadOBJModel(objText) {
  const loader = new OBJLoader();
  const object = loader.parse(objText);

  // Clear previous models
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child.type === 'Group') scene.remove(child);
  }

  object.traverse(child => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
      child.geometry.computeVertexNormals();
    }
  });

  object.position.set(0, 0, 0);
  scene.add(object);
}
