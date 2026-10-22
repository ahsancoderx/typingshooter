'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CanvasTexture, MeshBasicMaterial, SRGBColorSpace, SpriteMaterial } from 'three';
import { POOL, WORLD } from '@/lib/gameConfig';

const range = (n) => Array.from({ length: n }, (_, i) => i);
const BUBBLE_COLORS = [
  '#F7C948',
  '#E9695C',
  '#A8D5BA',
  '#BFA7F0',
  '#8EC9F5',
  '#F2A65A',
  '#F4B6C2',
  '#9AD1C9',
];
const LABEL_FONT = 'bold 92px Consolas, "Courier New", monospace';

function Loop({ engine }) {
  useFrame((state, dt) => {
    engine.setHalfW(Math.min(8, Math.max(2, state.viewport.width / 2 - 2.2)));
    engine.update(Math.min(dt, 0.05));
  });
  return null;
}

function makeLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const material = new SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  return { ctx: canvas.getContext('2d'), texture, material };
}

// Bubble text drawn on a canvas texture: typed letters blue, the rest dark ink with a cream outline.
function drawLabel(label, text, progress) {
  const c = label.ctx;
  c.clearRect(0, 0, 1024, 512);
  c.font = LABEL_FONT;
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.lineJoin = 'round';
  c.lineWidth = 12;
  c.strokeStyle = 'rgba(251,249,239,0.95)';
  const typed = text.slice(0, progress);
  const x = (1024 - c.measureText(text).width) / 2;
  c.strokeText(text, x, 262);
  c.fillStyle = '#1456C8';
  c.fillText(typed, x, 262);
  c.fillStyle = '#16201E';
  c.fillText(text.slice(progress), x + c.measureText(typed).width, 262);
  label.texture.needsUpdate = true;
}

function BubbleView({ engine, index }) {
  const group = useRef(null);
  const mesh = useRef(null);
  const mat = useRef(null);
  const seen = useRef('');
  const label = useMemo(() => makeLabel(), []);
  const color = BUBBLE_COLORS[index % BUBBLE_COLORS.length];
  useEffect(
    () => () => {
      label.texture.dispose();
      label.material.dispose();
    },
    [label],
  );
  useFrame(() => {
    const b = engine.bubbles[index];
    const g = group.current;
    if (!g) return;
    g.visible = b.alive;
    if (!b.alive) return;
    g.position.set(b.x, b.y, 0);
    const pulse = b === engine.active || b.dying ? 1 + 0.04 * Math.sin(engine.time * 10) : 1;
    if (mesh.current) mesh.current.scale.setScalar(b.r * pulse);
    const key = `${b.version}|${b.text}|${b.progress}`;
    if (seen.current !== key) {
      seen.current = key;
      drawLabel(label, b.text, b.progress);
    }
    if (mat.current) mat.current.emissiveIntensity = b === engine.active ? 0.55 : b.dying ? 0.9 : 0.12;
  });
  return (
    <group ref={group} visible={false}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial
          ref={mat}
          color={color}
          emissive={color}
          transparent
          opacity={0.9}
          roughness={0.25}
          clearcoat={1}
        />
      </mesh>
      <sprite scale={[5.12, 2.56, 1]} renderOrder={2}>
        <primitive object={label.material} attach="material" />
      </sprite>
    </group>
  );
}

function Cannon({ engine }) {
  const pivot = useRef(null);
  const barrel = useRef(null);
  const mat = useRef(null);
  useFrame(() => {
    if (pivot.current) pivot.current.rotation.z = -engine.aim;
    if (barrel.current) barrel.current.position.y = -engine.recoil * 0.35;
    if (mat.current) mat.current.color.set(engine.wrongT > 0 ? '#C62F2F' : '#E9695C');
  });
  return (
    <group position={[0, WORLD.cannonY, 0]}>
      <mesh>
        <cylinderGeometry args={[0.9, 1.2, 0.6, 24]} />
        <meshStandardMaterial color="#12211F" roughness={0.6} />
      </mesh>
      <group ref={pivot}>
        <group ref={barrel}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.25, 0.38, 1.6, 16]} />
            <meshStandardMaterial ref={mat} color="#E9695C" roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.75, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.28, 0.06, 8, 20]} />
            <meshBasicMaterial color="#F7C948" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Projectiles({ engine }) {
  const refs = useRef([]);
  useFrame(() => {
    engine.projs.forEach((p, i) => {
      const m = refs.current[i];
      if (m) {
        m.visible = p.alive;
        m.position.set(p.x, p.y, 0);
      }
    });
  });
  return (
    <>
      {range(POOL.projectiles).map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#FBF9EF" />
        </mesh>
      ))}
    </>
  );
}

function Particles({ engine }) {
  const refs = useRef([]);
  const mats = useMemo(
    () => ['#6FC3F7', '#FBF9EF', '#E9695C'].map((c) => new MeshBasicMaterial({ color: c })),
    [],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  useFrame(() => {
    engine.parts.forEach((p, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.visible = p.alive;
      if (p.alive) {
        m.position.set(p.x, p.y, p.z);
        m.scale.setScalar(Math.max(0.05, p.life / p.max));
        m.material = mats[p.col];
      }
    });
  });
  return (
    <>
      {range(POOL.particles).map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.12, 6, 6]} />
        </mesh>
      ))}
    </>
  );
}

export default function GameScene({ engine }) {
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 50 }} dpr={[1, 2]} aria-label="3D typing game arena">
      <color attach="background" args={['#1F3B37']} />
      <fog attach="fog" args={['#1F3B37', 18, 40]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 8]} intensity={1.3} />
      <gridHelper args={[60, 60, '#5C8F86', '#35605A']} position={[0, -6.2, -4]} />
      <mesh position={[0, WORLD.danger, -0.2]}>
        <planeGeometry args={[40, 0.07]} />
        <meshBasicMaterial color="#E9695C" />
      </mesh>
      <Loop engine={engine} />
      <Cannon engine={engine} />
      {range(POOL.bubbles).map((i) => (
        <BubbleView key={i} engine={engine} index={i} />
      ))}
      <Projectiles engine={engine} />
      <Particles engine={engine} />
    </Canvas>
  );
}
