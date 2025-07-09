import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

window.checkPIN = function () {
  const pin = document.getElementById("pin-input").value;
  const correctPIN = "2026";

  if (pin === correctPIN) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("viewer-container").style.display = "block";
    initViewer();
  } else {
    document.getElementById("error-message").innerText = "Incorrect PIN. Try again.";
  }
};

let scene, camera, renderer, controls;

function initViewer() {
  const canvas = document.getElementById("viewerCanvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  scene.add(dirLight);

  animate();
  setupDragAndDrop();
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function setupDragAndDrop() {
  const dropZone = document.getElementById("dropZone");
  window.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.pointerEvents = "auto";
  });
  window.addEventListener("dragleave", (e) => {
    dropZone.style.pointerEvents = "none";
  });
  window.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.pointerEvents = "none";
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".obj")) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const contents = event.target.result;
        loadOBJ(contents);
      };
      reader.readAsText(file);
    }
  });
}

function loadOBJ(objText) {
  const loader = new OBJLoader();
  const object = loader.parse(objText);

  // Clear previous models
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child.type === "Group") scene.remove(child);
  }

  object.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ color: 0x6699ff });
      child.geometry.computeVertexNormals();
    }
  });

  object.position.set(0, 0, 0);
  scene.add(object);
}
