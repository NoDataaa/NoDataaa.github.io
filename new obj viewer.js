<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>3D OBJ+MTL Viewer</title>
  <style>
    body { margin: 0; overflow: hidden; font-family: sans-serif; }
    #dropZone {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.1); z-index: 10; display: flex;
      align-items: center; justify-content: center; color: #444;
      font-size: 24px; pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="dropZone" style="display: none">Drop OBJ and MTL Files Here</div>
  <script type="module">
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';
    import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/loaders/OBJLoader.js';
    import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/loaders/MTLLoader.js';

    let scene, camera, renderer, controls;
    let dropZone = document.getElementById('dropZone');

    init();

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

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
      window.addEventListener('resize', onWindowResize);
      setupDragAndDrop();
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
      let files = {};

      window.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.style.display = 'flex';
      });

      window.addEventListener('dragleave', e => {
        dropZone.style.display = 'none';
      });

      window.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.style.display = 'none';

        files = {};
        for (const file of e.dataTransfer.files) {
          files[file.name.toLowerCase()] = file;
        }

        if (files['model.obj']) {
          const manager = new THREE.LoadingManager();

          manager.setURLModifier((url) => {
            const lowerUrl = url.toLowerCase();
            if (files[lowerUrl]) {
              const blob = new Blob([files[lowerUrl]], { type: 'text/plain' });
              return URL.createObjectURL(blob);
            }
            return url;
          });

          if (files['model.mtl']) {
            const mtlLoader = new MTLLoader(manager);
            mtlLoader.load(URL.createObjectURL(files['model.mtl']), materials => {
              materials.preload();
              const objLoader = new OBJLoader(manager);
              objLoader.setMaterials(materials);
              objLoader.load(URL.createObjectURL(files['model.obj']), object => {
                clearScene();
                scene.add(object);
              });
            });
          } else {
            const objLoader = new OBJLoader(manager);
            objLoader.load(URL.createObjectURL(files['model.obj']), object => {
              clearScene();
              scene.add(object);
            });
          }
        } else {
          alert("Please make sure to drop 'model.obj' (and optionally 'model.mtl')");
        }
      });
    }

    function clearScene() {
      for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];
        if (child.type === 'Group') scene.remove(child);
      }
    }
  </script>
</body>
</html>
