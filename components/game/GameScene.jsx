'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MeshBasicMaterial } from 'three';
import { POOL, WORLD } from '@/lib/gameConfig';
const range = (n) => Array.from({ length: n }, (_, i) => i);
function Loop({ engine }) {
  useFrame((state, dt) => {
    engine.setHalfW(Math.min(8, Math.max(2, state.viewport.width / 2 - 1.6)));
    engine.update(Math.min(dt, 0.05));
  });
  return null;
}
function BubbleView({ engine, index }) {
  const g = useRef(null);
  const mat = useRef(null);
  const label = useRef(null);
  const seen = useRef(-1);
  useFrame(() => {
    const b = engine.bubbles[index],
      grp = g.current,
      el = label.current;
    if (!grp || !el) return;
    grp.visible = b.alive;
    el.style.display = b.alive ? 'block' : 'none';
    if (!b.alive) return;
    grp.position.set(b.x, b.y, 0);
    grp.scale.setScalar(b.r);
    if (seen.current !== b.version) {
      seen.current = b.version;
      el.innerHTML = `<span class="bt-hit">${b.text.slice(0, b.progress)}</span>${b.text.slice(b.progress)}`;
    }
    if (mat.current) mat.current.emissiveIntensity = b === engine.active ? 1.8 : b.dying ? 2.4 : 0.6;
  });
  return (
    <group ref={g} visible={false}>
      <mesh>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial
          ref={mat}
          color="#5aa8ff"
          emissive="#1457d9"
          transparent
          opacity={0.38}
          roughness={0.08}
          clearcoat={1}
        />
      </mesh>
      <Html center style={{ pointerEvents: 'none' }}>
        <div ref={label} className="bt-label" />
      </Html>
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
    if (mat.current) mat.current.color.set(engine.wrongT > 0 ? '#ff5c78' : '#3d8bff');
  });
  return (
    <group position={[0, WORLD.cannonY, 0]}>
      <mesh>
        <cylinderGeometry args={[0.9, 1.2, 0.6, 24]} />
        <meshStandardMaterial color="#26335c" metalness={0.6} roughness={0.4} />
      </mesh>
      <group ref={pivot}>
        <group ref={barrel}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.25, 0.38, 1.6, 16]} />
            <meshStandardMaterial
              ref={mat}
              color="#3d8bff"
              metalness={0.5}
              roughness={0.35}
              emissive="#0b2a66"
            />
          </mesh>
          <mesh position={[0, 1.75, 0]}>
            <torusGeometry args={[0.28, 0.06, 8, 20]} rotation-x={Math.PI / 2} />
            <meshBasicMaterial color="#8b6cff" />
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
          <meshBasicMaterial color="#8fd3ff" />
        </mesh>
      ))}
    </>
  );
}
function Particles({ engine }) {
  const refs = useRef([]);
  const mats = useMemo(
    () => ['#4da3ff', '#ffffff', '#ff5c78'].map((c) => new MeshBasicMaterial({ color: c })),
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
      <color attach="background" args={['#080d1d']} />
      <fog attach="fog" args={['#080d1d', 18, 40]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 8]} intensity={1.4} />
      <pointLight position={[0, -4, 6]} intensity={30} color="#3a8cff" />
      <gridHelper args={[60, 60, '#1e5cff', '#12306b']} position={[0, -6.2, -4]} />
      <mesh position={[0, WORLD.danger, -0.2]}>
        <planeGeometry args={[40, 0.06]} />
        <meshBasicMaterial color="#ff3355" />
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
