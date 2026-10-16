'use client';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { hasWebGL } from '@/lib/webgl';
export default function Progress3DChart({ bars }) {
  if (!hasWebGL()) return null;
  const max = Math.max(10, ...bars.map((b) => b.wpm));
  const gap = 1.1,
    offset = ((bars.length - 1) * gap) / 2;
  return (
    <div
      className="chart3d"
      role="img"
      aria-label={`3D bar chart of WPM for your last ${bars.length} results. The same data is in the table below.`}
    >
      <Canvas camera={{ position: [0, 4, 11], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#0b1226']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 6]} intensity={1.4} />
        <gridHelper args={[16, 16, '#1e5cff', '#12306b']} />
        {bars.map((b, i) => {
          const h = Math.max(0.05, (b.wpm / max) * 5);
          return (
            <group key={b.n} position={[i * gap - offset, 0, 0]}>
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[0.7, h, 0.7]} />
                <meshStandardMaterial color="#3d8bff" roughness={0.4} />
              </mesh>
              <Html position={[0, h + 0.4, 0]} center style={{ pointerEvents: 'none' }}>
                <span className="bar3d-label">{b.wpm}</span>
              </Html>
              <Html position={[0, -0.35, 0.6]} center style={{ pointerEvents: 'none' }}>
                <span className="bar3d-label muted">#{b.n}</span>
              </Html>
            </group>
          );
        })}
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
}
