/**
 * CTA section effects: gradient mesh background, ripple on buttons
 */
import * as THREE from 'three';
import { isMobile, isReducedMotion } from './utils.js';

/**
 * Animated gradient mesh background for CTA section
 */
export function initCtaEffects() {
  const canvas = document.getElementById('ctaCanvas');

  // Animated gradient via WebGL (desktop)
  if (canvas && !isMobile() && !isReducedMotion()) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Fullscreen quad with animated gradient shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x1B6B93) },
        uColor2: { value: new THREE.Color(0x4FC3F7) },
        uColor3: { value: new THREE.Color(0x80DEEA) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        void main() {
          float t = uTime * 0.3;
          vec2 uv = vUv;

          float d1 = distance(uv, vec2(0.3 + sin(t) * 0.2, 0.5 + cos(t * 0.7) * 0.3));
          float d2 = distance(uv, vec2(0.7 + cos(t * 0.8) * 0.2, 0.3 + sin(t * 0.6) * 0.3));
          float d3 = distance(uv, vec2(0.5 + sin(t * 0.5) * 0.3, 0.7 + cos(t * 0.9) * 0.2));

          vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 1.0, d1));
          color = mix(color, uColor3, smoothstep(0.0, 1.0, d2));
          color = mix(color, uColor1, smoothstep(0.3, 0.8, d3));

          float alpha = 0.15 * (1.0 - smoothstep(0.0, 0.8, min(d1, min(d2, d3))));
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = performance.now();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animate = () => {
            requestAnimationFrame(animate);
            material.uniforms.uTime.value = (performance.now() - startTime) / 1000;
            renderer.render(scene, camera);
          };
          animate();
          observer.unobserve(canvas);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(canvas);

    window.addEventListener('resize', () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
  }

  // Ripple effect on all primary buttons
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--ripple-x', `${x}%`);
      btn.style.setProperty('--ripple-y', `${y}%`);
      btn.classList.add('ripple');
      setTimeout(() => btn.classList.remove('ripple'), 400);
    });
  });
}
