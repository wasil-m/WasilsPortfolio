import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';

function Shards({ mouse }) {
  const group = useRef();
  const shards = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 1,
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.08 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.7,
        gold: i % 3 === 0,
      });
    }
    return arr;
  }, []);
  const refs = useRef([]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.04 + mouse.current.x * 0.15;
      group.current.rotation.x = mouse.current.y * 0.1;
    }
    refs.current.forEach((m, i) => {
      if (!m) return;
      const s = shards[i];
      m.position.y = s.pos[1] + Math.sin(t * s.speed + s.phase) * 0.4;
      m.rotation.x += 0.004 * s.speed;
      m.rotation.y += 0.006 * s.speed;
    });
  });
  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={s.pos}
          rotation={s.rot}
          scale={s.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.gold ? '#e8b94a' : '#f5ece4'}
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const onMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  return (
    <div className="hero3d" onMouseMove={onMove} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} color="#ffe9c9" />
        <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffe2b0" />
        <pointLight position={[-5, -3, 2]} intensity={2.2} color="#9db66c" />
        <pointLight position={[3, 2, 4]} intensity={3} color="#e8b94a" />
        <Shards mouse={mouse} />
      </Canvas>
    </div>
  );
}
