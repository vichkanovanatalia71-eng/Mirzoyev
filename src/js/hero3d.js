/**
 * Hero 3D Scene — Procedural tooth with particles, bloom, mouse parallax
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { lerp, isMobile, isReducedMotion } from './utils.js';

let scene, camera, renderer, composer;
let toothGroup, particleSystem;
let mouseX = 0, mouseY = 0;
let targetRotX = 0, targetRotY = 0;
let animationId;
let isInitialized = false;

/**
 * Create procedural tooth geometry using LatheGeometry
 */
function createToothGeometry() {
  // Crown profile curve
  const points = [];
  // Root (bottom to middle)
  points.push(new THREE.Vector2(0, -2.2));
  points.push(new THREE.Vector2(0.15, -2.0));
  points.push(new THREE.Vector2(0.25, -1.6));
  points.push(new THREE.Vector2(0.35, -1.2));
  points.push(new THREE.Vector2(0.5, -0.8));
  points.push(new THREE.Vector2(0.65, -0.4));
  // Neck
  points.push(new THREE.Vector2(0.6, -0.1));
  points.push(new THREE.Vector2(0.55, 0.0));
  // Crown (widest part)
  points.push(new THREE.Vector2(0.7, 0.3));
  points.push(new THREE.Vector2(0.85, 0.6));
  points.push(new THREE.Vector2(0.9, 0.9));
  points.push(new THREE.Vector2(0.88, 1.2));
  points.push(new THREE.Vector2(0.8, 1.5));
  // Top (cusps)
  points.push(new THREE.Vector2(0.65, 1.7));
  points.push(new THREE.Vector2(0.45, 1.85));
  points.push(new THREE.Vector2(0.2, 1.9));
  points.push(new THREE.Vector2(0.0, 1.92));

  const geometry = new THREE.LatheGeometry(points, 48);
  return geometry;
}

/**
 * Create floating particles around tooth
 */
function createParticles(count = 200) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 2 + Math.random() * 4;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random() * 3 + 1;
    speeds[i] = Math.random() * 0.5 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

  const material = new THREE.PointsMaterial({
    color: 0x4FC3F7,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Initialize the hero 3D scene
 */
export function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || isInitialized) return;
  isInitialized = true;

  const mobile = isMobile();
  const reducedMotion = isReducedMotion();

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.5, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: true,
    powerPreference: mobile ? 'low-power' : 'high-performance',
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Tooth
  toothGroup = new THREE.Group();
  const toothGeo = createToothGeometry();
  const toothMat = new THREE.MeshPhysicalMaterial({
    color: 0xF0EDE8,
    metalness: 0.05,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 0.9,
    envMapIntensity: 1.5,
    transparent: true,
    opacity: 0.95,
  });
  const toothMesh = new THREE.Mesh(toothGeo, toothMat);
  toothMesh.scale.set(1.1, 1.1, 1.1);
  toothGroup.add(toothMesh);

  // Subtle inner glow mesh
  const glowGeo = createToothGeometry();
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x4FC3F7,
    transparent: true,
    opacity: 0.03,
    side: THREE.BackSide,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.scale.set(1.15, 1.15, 1.15);
  toothGroup.add(glowMesh);

  scene.add(toothGroup);

  // Position tooth to the right on desktop
  if (!mobile) {
    toothGroup.position.set(2.5, -0.3, 0);
  } else {
    toothGroup.position.set(0, -0.5, 0);
    toothGroup.scale.set(0.8, 0.8, 0.8);
  }

  // Particles (desktop only)
  if (!mobile && !reducedMotion) {
    particleSystem = createParticles(150);
    particleSystem.position.copy(toothGroup.position);
    scene.add(particleSystem);
  }

  // === Lighting ===
  // Key light
  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  // Fill light
  const fillLight = new THREE.AmbientLight(0x4FC3F7, 0.3);
  scene.add(fillLight);

  // Rim light (from behind)
  const rimLight = new THREE.SpotLight(0x80DEEA, 1.5, 20, Math.PI / 4);
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);

  // Specular highlight light (animated)
  const specLight = new THREE.PointLight(0x4FC3F7, 0.8, 10);
  specLight.position.set(2, 3, 3);
  scene.add(specLight);

  // Post-processing (desktop only)
  if (!mobile && !reducedMotion) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      0.4,  // strength
      0.5,  // radius
      0.85  // threshold
    );
    composer.addPass(bloomPass);
  }

  // Mouse tracking
  if (!mobile) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  // Resize
  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (composer) composer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // Entrance animation
  toothGroup.scale.set(0, 0, 0);
  const startTime = performance.now();

  // Animation loop
  function animate(time) {
    animationId = requestAnimationFrame(animate);

    const elapsed = (time - startTime) / 1000;

    // Entrance animation (first 1.5 seconds)
    if (elapsed < 1.5) {
      const progress = Math.min(elapsed / 1.2, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const baseScale = mobile ? 0.8 : 1;
      toothGroup.scale.setScalar(ease * baseScale);
    }

    // Idle rotation
    if (!reducedMotion) {
      toothGroup.rotation.y += 0.003;
    }

    // Mouse parallax (desktop)
    if (!mobile) {
      targetRotX = mouseY * 0.15;
      targetRotY = mouseX * 0.15;
      toothGroup.rotation.x = lerp(toothGroup.rotation.x, targetRotX, 0.05);
      // y rotation already includes idle, so add parallax
      const baseRotY = toothGroup.rotation.y;
      toothGroup.rotation.y = lerp(baseRotY, baseRotY + targetRotY * 0.01, 0.05);
    }

    // Specular light sweep
    specLight.position.x = Math.sin(elapsed * 0.5) * 4;
    specLight.position.z = Math.cos(elapsed * 0.3) * 4;

    // Animate particles
    if (particleSystem) {
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed + i) * 0.001;
        positions[i] += Math.cos(elapsed * 0.5 + i) * 0.0005;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.001;
    }

    // Render
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  animate(performance.now());
}

/**
 * Cleanup
 */
export function destroyHero3D() {
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
  isInitialized = false;
}
