/**
 * Before/After comparison slider with 3D morph + 2D fallback
 */
import * as THREE from 'three';
import { isMobile, isReducedMotion, clamp } from './utils.js';

let scene, camera, renderer;
let toothBefore, toothAfter;
let morphProgress = 0.5;
let animationId;
let isInitialized = false;

/**
 * Create a "damaged" tooth geometry (before)
 */
function createToothBefore() {
  const points = [];
  points.push(new THREE.Vector2(0, -1.8));
  points.push(new THREE.Vector2(0.15, -1.6));
  points.push(new THREE.Vector2(0.3, -1.2));
  points.push(new THREE.Vector2(0.45, -0.7));
  points.push(new THREE.Vector2(0.55, -0.2));
  // Irregular crown
  points.push(new THREE.Vector2(0.5, 0.1));
  points.push(new THREE.Vector2(0.65, 0.5));
  points.push(new THREE.Vector2(0.72, 0.8));
  points.push(new THREE.Vector2(0.68, 1.1));
  points.push(new THREE.Vector2(0.55, 1.3));
  points.push(new THREE.Vector2(0.35, 1.45));
  points.push(new THREE.Vector2(0.15, 1.5));
  points.push(new THREE.Vector2(0, 1.52));

  const geometry = new THREE.LatheGeometry(points, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xD4C5A0,
    metalness: 0.02,
    roughness: 0.4,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a perfect tooth geometry (after)
 */
function createToothAfter() {
  const points = [];
  points.push(new THREE.Vector2(0, -1.8));
  points.push(new THREE.Vector2(0.12, -1.6));
  points.push(new THREE.Vector2(0.25, -1.2));
  points.push(new THREE.Vector2(0.4, -0.7));
  points.push(new THREE.Vector2(0.52, -0.2));
  // Smooth crown
  points.push(new THREE.Vector2(0.48, 0.05));
  points.push(new THREE.Vector2(0.62, 0.4));
  points.push(new THREE.Vector2(0.75, 0.8));
  points.push(new THREE.Vector2(0.78, 1.1));
  points.push(new THREE.Vector2(0.72, 1.4));
  points.push(new THREE.Vector2(0.58, 1.6));
  points.push(new THREE.Vector2(0.38, 1.75));
  points.push(new THREE.Vector2(0.18, 1.82));
  points.push(new THREE.Vector2(0, 1.85));

  const geometry = new THREE.LatheGeometry(points, 48);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xF0EDE8,
    metalness: 0.05,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 0.9,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Initialize 3D before/after scene
 */
function init3D(canvas) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
  camera.position.set(0, 0.3, 5);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // Teeth
  toothBefore = createToothBefore();
  toothBefore.position.set(-1.5, 0, 0);
  scene.add(toothBefore);

  toothAfter = createToothAfter();
  toothAfter.position.set(1.5, 0, 0);
  scene.add(toothAfter);

  // Lighting
  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
  keyLight.position.set(2, 4, 5);
  scene.add(keyLight);

  const ambient = new THREE.AmbientLight(0x4FC3F7, 0.3);
  scene.add(ambient);

  const rimLight = new THREE.PointLight(0x80DEEA, 0.8, 15);
  rimLight.position.set(-3, 1, -3);
  scene.add(rimLight);

  // Dividing plane (translucent)
  const dividerGeo = new THREE.PlaneGeometry(0.02, 4);
  const dividerMat = new THREE.MeshBasicMaterial({
    color: 0x4FC3F7,
    transparent: true,
    opacity: 0.8,
  });
  const divider = new THREE.Mesh(dividerGeo, dividerMat);
  divider.position.set(0, 0, 0.5);
  scene.add(divider);

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  function animate() {
    animationId = requestAnimationFrame(animate);

    // Gentle rotation
    if (toothBefore) toothBefore.rotation.y += 0.005;
    if (toothAfter) toothAfter.rotation.y += 0.005;

    renderer.render(scene, camera);
  }
  animate();
}

/**
 * Initialize 2D slider functionality
 */
function init2DSlider(container) {
  const handle = document.getElementById('baHandle');
  const afterWrapper = document.getElementById('afterImageWrapper');
  if (!handle || !afterWrapper) return;

  let isDragging = false;
  let sliderValue = 0.5;

  const updateSlider = (value) => {
    sliderValue = clamp(value, 0.02, 0.98);
    const pct = sliderValue * 100;
    handle.style.left = `${pct}%`;
    afterWrapper.style.clipPath = `inset(0 0 0 ${pct}%)`;
  };

  const getPosition = (e) => {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return (clientX - rect.left) / rect.width;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(getPosition(e));
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(getPosition(e));
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(getPosition(e));
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(getPosition(e));
  }, { passive: true });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });

  // Auto-demo on first view
  if (!isReducedMotion()) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate from 50% to 25% and back
          let start = null;
          const duration = 1500;
          const autoAnimate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            if (progress < 0.5) {
              updateSlider(0.5 - progress * 0.5);
            } else if (progress < 1) {
              updateSlider(0.25 + (progress - 0.5) * 0.5);
            } else {
              updateSlider(0.5);
              return;
            }
            requestAnimationFrame(autoAnimate);
          };
          setTimeout(() => requestAnimationFrame(autoAnimate), 500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(container);
  }

  updateSlider(0.5);
}

/**
 * Main init
 */
export function initBeforeAfter() {
  const container = document.getElementById('beforeAfter');
  if (!container || isInitialized) return;
  isInitialized = true;

  const canvas = document.getElementById('beforeAfterCanvas');
  const fallback = document.getElementById('beforeAfter2D');

  if (!isMobile() && canvas) {
    // Desktop: 3D version
    canvas.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
    init3D(canvas);
  } else {
    // Mobile: 2D slider
    if (canvas) canvas.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    init2DSlider(container);
  }
}
