/**
 * Particle wave animation in footer
 */
import * as THREE from 'three';
import { isMobile, isReducedMotion } from './utils.js';

let animationId;

export function initFooterParticles() {
  const canvas = document.getElementById('footerCanvas');
  if (!canvas || isMobile() || isReducedMotion()) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Particle grid (wave)
  const cols = 40;
  const rows = 20;
  const count = cols * rows;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = (i * rows + j) * 3;
      positions[idx] = (i - cols / 2) * 0.4;
      positions[idx + 1] = 0;
      positions[idx + 2] = (j - rows / 2) * 0.4;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4FC3F7,
    size: 0.03,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Animation
  const startTime = performance.now();

  function animate(time) {
    animationId = requestAnimationFrame(animate);
    const elapsed = (time - startTime) / 1000;
    const pos = geometry.attributes.position.array;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = (i * rows + j) * 3;
        pos[idx + 1] = Math.sin(i * 0.3 + elapsed * 0.8) * 0.3 +
                        Math.cos(j * 0.3 + elapsed * 0.5) * 0.2;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Lazy init — start only when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(performance.now());
        observer.unobserve(canvas);
      }
    });
  }, { threshold: 0.1 });
  observer.observe(canvas);

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
