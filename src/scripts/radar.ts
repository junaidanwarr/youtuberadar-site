/**
 * Hero radar — a dotted dome swept by a rotating beam.
 * Signals ("blips") flare as the beam passes; a few carry category labels.
 *
 * Loaded lazily. Falls back to the static CSS radar underneath when WebGL is
 * unavailable, and renders a single still frame under reduced motion.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  MeshBasicMaterial,
  Vector3,
  WebGLRenderer,
  DoubleSide,
} from 'three';

const TAU = Math.PI * 2;
const R = 4.2;

interface Blip {
  theta: number;
  phi: number;
  pos: Vector3;
  label?: HTMLElement;
}

export function mountRadar(host: HTMLElement) {
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  const labelLayer = host.querySelector<HTMLElement>('[data-radar-labels]');
  if (!canvas) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // static fallback stays visible
  }
  const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 60);
  const rig = new Group(); // parallax target
  const dome = new Group();
  rig.add(dome);
  scene.add(rig);

  const uniforms = {
    uSweep: { value: 0.6 },
    uTime: { value: 0 },
    uPx: { value: 1 },
    uBlue: { value: new Color('#c86bff') },
    uViolet: { value: new Color('#ff5c8a') },
  };

  /* ---------- Dotted dome: latitude rings of points ---------- */
  const pts: number[] = [];
  const seeds: number[] = [];
  const rings = small ? 30 : 46;
  const spacing = small ? 0.2 : 0.135;
  const phiMax = Math.PI * 0.6;
  for (let i = 1; i <= rings; i++) {
    const phi = (i / rings) * phiMax;
    const ringR = R * Math.sin(phi);
    const n = Math.max(6, Math.round((TAU * ringR) / spacing));
    const offset = (i % 2) * (Math.PI / n);
    for (let j = 0; j < n; j++) {
      const th = (j / n) * TAU + offset;
      pts.push(ringR * Math.cos(th), R * Math.cos(phi), ringR * Math.sin(th));
      seeds.push(Math.random());
    }
  }
  const domeGeo = new BufferGeometry();
  domeGeo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
  domeGeo.setAttribute('aSeed', new BufferAttribute(new Float32Array(seeds), 1));

  const pointVert = /* glsl */ `
    attribute float aSeed;
    uniform float uSweep, uTime, uPx, uDecay, uBase, uSize;
    varying float vI;
    varying float vHot;
    varying float vMix;
    varying vec3 vN;
    void main() {
      vec3 p = position;
      float ang = atan(p.z, p.x);
      float d = mod(uSweep - ang, 6.2831853);
      float trail = exp(-d * uDecay);
      float tw = 0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 40.0);
      vec3 n = normalize(normalMatrix * normalize(p));
      float facing = mix(0.55, 1.0, smoothstep(-0.1, 0.5, n.z));
      vN = n;
      vI = (uBase + uBase * 0.6 * tw + trail * 1.15) * facing;
      vHot = trail;
      vMix = clamp(p.y / ${R.toFixed(1)}, 0.0, 1.0);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = uPx * uSize * (1.0 + trail * 1.5) * (7.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`;
  const pointFrag = /* glsl */ `
    precision mediump float;
    uniform vec3 uBlue, uViolet;
    uniform float uSoft;
    varying float vI;
    varying float vHot;
    varying float vMix;
    varying vec3 vN;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      float a = mix(smoothstep(0.5, 0.32, r), pow(smoothstep(0.5, 0.0, r), 2.2), uSoft);
      // White dots in the body of the globe, picking up the limb colours at the edge.
      float rim = pow(1.0 - clamp(vN.z, 0.0, 1.0), 1.6);
      vec3 limb = mix(vec3(1.0, 0.16, 0.24), vec3(0.2, 0.36, 1.0), smoothstep(-0.35, 0.35, vN.x));
      limb = mix(limb, vec3(1.0, 0.25, 0.9), smoothstep(0.55, 0.05, vN.y));
      vec3 col = mix(vec3(0.82, 0.86, 1.0), limb, clamp(rim * 1.5, 0.0, 1.0));
      col = mix(col, mix(uBlue, uViolet, vMix), 0.12);
      col = mix(col, vec3(0.86, 0.93, 1.0), clamp(vHot * 1.2, 0.0, 1.0));
      gl_FragColor = vec4(col * min(vI, 1.4), a);
    }`;

  const makePointMat = (decay: number, base: number, size: number, soft: number) =>
    new ShaderMaterial({
      uniforms: {
        ...uniforms,
        uDecay: { value: decay },
        uBase: { value: base },
        uSize: { value: size },
        uSoft: { value: soft },
      },
      vertexShader: pointVert,
      fragmentShader: pointFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

  /* ---------- Solid body (hides the far side) and coloured limb glow ---------- */
  const body = new Mesh(new SphereGeometry(R * 0.985, 64, 48), new MeshBasicMaterial({ color: 0x020308 }));
  dome.add(body);
  const limb = new Mesh(
    new SphereGeometry(R * 0.992, 64, 48),
    new ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec3 vN;
        void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform float uTime;
        varying vec3 vN;
        void main() {
          float f = pow(1.0 - clamp(vN.z, 0.0, 1.0), 2.6);
          vec3 col = mix(vec3(1.0, 0.1, 0.2), vec3(0.12, 0.25, 1.0), smoothstep(-0.3, 0.3, vN.x));
          col = mix(col, vec3(1.0, 0.2, 0.92), smoothstep(0.6, 0.1, vN.y));
          float shimmer = 0.88 + 0.12 * sin(uTime * 0.9 + vN.x * 5.0);
          gl_FragColor = vec4(col * f * shimmer * 1.25, f);
        }`,
      uniforms: { uTime: uniforms.uTime },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  dome.add(limb);

  const mats: ShaderMaterial[] = [];
  const domeMat = makePointMat(1.7, 0.42, 3.6, 0.0);
  mats.push(domeMat);
  dome.add(new Points(domeGeo, domeMat));

  /* ---------- Range rings ---------- */
  const ringMat = new LineBasicMaterial({ color: 0xd9a6ff, transparent: true, opacity: 0.16 });
  for (const f of [0.22, 0.46, 0.72, 0.985]) {
    const phi = f * (Math.PI / 2);
    const rr = R * 1.003 * Math.sin(phi);
    const y = R * 1.003 * Math.cos(phi);
    const seg = 160;
    const arr = new Float32Array(seg * 3);
    for (let i = 0; i < seg; i++) {
      const th = (i / seg) * TAU;
      arr[i * 3] = rr * Math.cos(th);
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = rr * Math.sin(th);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(arr, 3));
    dome.add(new LineLoop(g, ringMat));
  }

  /* ---------- Sweep wedge ---------- */
  const wedgeLen = 0.85;
  const wedge = new Mesh(
    new SphereGeometry(R * 1.006, 40, 40, 0, wedgeLen, 0, phiMax),
    new ShaderMaterial({
      uniforms: { uBlue: uniforms.uBlue },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uBlue;
        varying vec2 vUv;
        void main() {
          float t = 1.0 - vUv.x;
          float edge = smoothstep(0.985, 1.0, t);
          float a = pow(t, 2.6) * 0.2 + edge * 0.75;
          gl_FragColor = vec4(mix(uBlue, vec3(0.85, 0.93, 1.0), edge), a);
        }`,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
    }),
  );
  dome.add(wedge);

  /* ---------- Blips ---------- */
  const labelEls = labelLayer ? Array.from(labelLayer.querySelectorAll<HTMLElement>('[data-blip]')) : [];
  const blips: Blip[] = [];
  const blipCount = small ? 9 : 16;
  // Deterministic placement so the composition is the same on every visit.
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < blipCount; i++) {
    // Spread labelled blips across the camera-facing half (+z).
    const labelled = i < labelEls.length;
    const theta = labelled ? 0.4 + (i / Math.max(1, labelEls.length)) * TAU : rnd() * TAU;
    const phi = labelled ? 0.34 + ((i * 0.37) % 0.5) : 0.2 + rnd() * 1.25;
    const pos = new Vector3(
      R * 1.01 * Math.sin(phi) * Math.cos(theta),
      R * 1.01 * Math.cos(phi),
      R * 1.01 * Math.sin(phi) * Math.sin(theta),
    );
    blips.push({ theta, phi, pos, label: labelled ? labelEls[i] : undefined });
  }
  const blipGeo = new BufferGeometry();
  blipGeo.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(blips.flatMap((b) => [b.pos.x, b.pos.y, b.pos.z])), 3),
  );
  blipGeo.setAttribute('aSeed', new BufferAttribute(new Float32Array(blips.map(() => rnd())), 1));
  const blipMat = makePointMat(0.55, 0.4, 13.0, 1.0);
  blipMat.uniforms.uViolet = { value: new Color('#c9bcff') };
  blipMat.uniforms.uBlue = { value: new Color('#9cc6ff') };
  mats.push(blipMat);
  dome.add(new Points(blipGeo, blipMat));

  /* ---------- Layout ---------- */
  let w = 0;
  let h = 0;
  function resize() {
    const r = host.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the dome a consistent share of the hero whatever the aspect ratio.
    const portrait = camera.aspect < 0.85;
    camera.fov = portrait ? 52 : 38;
    camera.position.set(0, portrait ? 2.3 : 1.9, portrait ? 11.5 : 10.2);
    camera.lookAt(0, portrait ? 0.9 : 1.25, 0);
    const scale = portrait ? 0.82 : Math.min(1.5, Math.max(1.0, camera.aspect / 1.45));
    dome.scale.setScalar(scale);
    // Pin the crown of the dome to a fixed height so it always rises from the fold.
    dome.position.y = (portrait ? -0.7 : 0.5) - R * scale;
    camera.updateProjectionMatrix();
    for (const m of mats) m.uniforms.uPx.value = dpr * (h / 900);
    draw();
  }

  /* ---------- Pointer parallax ---------- */
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  if (!reduce && matchMedia('(hover: hover)').matches) {
    addEventListener(
      'pointermove',
      (e) => {
        tx = (e.clientX / innerWidth - 0.5) * 2;
        ty = (e.clientY / innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  const v = new Vector3();
  function placeLabels(sweep: number) {
    for (const b of blips) {
      if (!b.label) continue;
      v.copy(b.pos);
      dome.localToWorld(v);
      const facing = v.z - dome.getWorldPosition(new Vector3()).z;
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      const d = (((sweep - b.theta) % TAU) + TAU) % TAU;
      const trail = Math.exp(-d * 0.55);
      const visible = facing > 1.4 && y < h - 30 && x > 60 && x < w - 60;
      b.label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      b.label.style.opacity = visible ? (0.28 + trail * 0.72).toFixed(3) : '0';
    }
  }

  function draw() {
    const sweep = uniforms.uSweep.value;
    wedge.rotation.y = -(sweep - Math.PI);
    rig.rotation.y = cx * 0.16;
    rig.rotation.x = cy * 0.05;
    renderer.render(scene, camera);
    if (labelEls.length) placeLabels(sweep);
  }

  let running = false;
  let raf = 0;
  let last = 0;
  function frame(t: number) {
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    uniforms.uTime.value += dt;
    uniforms.uSweep.value = (uniforms.uSweep.value + dt * 0.62) % TAU;
    dome.rotation.y -= dt * 0.07; // steady left-to-right spin
    cx += (tx - cx) * 0.045;
    cy += (ty - cy) * 0.045;
    draw();
    raf = requestAnimationFrame(frame);
  }
  const start = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new ResizeObserver(resize).observe(host);
  resize();
  host.classList.add('is-live');

  // Only animate while the hero is on screen and the tab is visible.
  let onScreen = true;
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    onScreen && !document.hidden ? start() : stop();
  }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden || !onScreen ? stop() : start()));
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    host.classList.remove('is-live');
  });
  start();
}
