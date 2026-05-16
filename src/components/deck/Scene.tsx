import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { assetUrl } from "@/lib/assets";

const MODEL_URL = assetUrl("model.glb");

/** Matches deck slide transition (Deck.tsx) */
const MODEL_TRANSITION_SEC = 0.85;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Particles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.01;
    const m = state.mouse;
    mouse.current.x += (m.x * 0.3 - mouse.current.x) * 0.05;
    mouse.current.y += (m.y * 0.3 - mouse.current.y) * 0.05;
    ref.current.position.x = mouse.current.x;
    ref.current.position.y = mouse.current.y;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#9bb0c4"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

type ModelPlacement = "center" | "side" | "corner" | "top";

const PLACEMENT: Record<
  ModelPlacement,
  { position: [number, number, number]; scale: number; parallax: number }
> = {
  center: { position: [0, 1.2, -2], scale: 1.6, parallax: 1 },
  top: { position: [0, 3.6, -2.4], scale: 0.78, parallax: 0.2 },
  side: { position: [5.5, 0, -2], scale: 0.725, parallax: 1 },
  corner: { position: [7.2, 3.1, -2.5], scale: 0.52, parallax: 0.25 },
};

type AnimState = {
  from: { pos: THREE.Vector3; scale: number; parallax: number };
  to: { pos: THREE.Vector3; scale: number; parallax: number };
  t: number;
};

function Model({
  placement,
  pointer,
  active,
}: {
  placement: ModelPlacement;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  active: React.MutableRefObject<boolean>;
}) {
  const ref = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const parallax = useRef(PLACEMENT.side.parallax);
  const anim = useRef<AnimState>({
    from: {
      pos: new THREE.Vector3(...PLACEMENT.center.position),
      scale: PLACEMENT.center.scale,
      parallax: PLACEMENT.center.parallax,
    },
    to: {
      pos: new THREE.Vector3(...PLACEMENT.center.position),
      scale: PLACEMENT.center.scale,
      parallax: PLACEMENT.center.parallax,
    },
    t: 1,
  });

  useEffect(() => {
    const cfg = PLACEMENT[placement];
    const group = ref.current;
    anim.current.from = {
      pos: group ? group.position.clone() : anim.current.to.pos.clone(),
      scale: group ? group.scale.x : anim.current.to.scale,
      parallax: parallax.current,
    };
    anim.current.to = {
      pos: new THREE.Vector3(...cfg.position),
      scale: cfg.scale,
      parallax: cfg.parallax,
    };
    anim.current.t = 0;
  }, [placement]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const a = anim.current;
    if (a.t < 1) a.t = Math.min(1, a.t + delta / MODEL_TRANSITION_SEC);
    const e = easeInOutCubic(a.t);

    ref.current.position.lerpVectors(a.from.pos, a.to.pos, e);
    const scale = THREE.MathUtils.lerp(a.from.scale, a.to.scale, e);
    ref.current.scale.setScalar(scale);
    parallax.current = THREE.MathUtils.lerp(a.from.parallax, a.to.parallax, e);

    const k = parallax.current;
    const targetRotY = active.current ? pointer.current.x * 0.8 * k : 0;
    const targetRotX = active.current ? -pointer.current.y * 0.5 * k : 0;
    ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * 0.08;
    ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.08;
  });

  return (
    <group ref={ref}>
      <primitive object={cloned} />
    </group>
  );
}
useGLTF.preload(MODEL_URL);

export function Scene({
  modelPlacement = "side",
  minimal = false,
}: {
  slideIndex?: number;
  modelPlacement?: ModelPlacement;
  minimal?: boolean;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const active = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      active.current = true;
    };
    const onLeave = () => { active.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={
        modelPlacement === "corner"
          ? "deck-scene deck-scene--corner"
          : modelPlacement === "top"
            ? "deck-scene deck-scene--top"
            : "deck-scene"
      }
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          modelPlacement === "corner"
            ? "radial-gradient(ellipse at 88% 12%, #151520 0%, #050509 65%)"
            : modelPlacement === "top"
              ? "radial-gradient(ellipse at 50% 14%, #151520 0%, #050509 68%)"
              : "radial-gradient(ellipse at 30% 20%, #111118 0%, #050509 70%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Particles count={minimal ? 400 : 1400} />
        {!minimal && (
          <Suspense fallback={null}>
            <Model placement={modelPlacement} pointer={pointer} active={active} />
          </Suspense>
        )}
      </Canvas>
    </div>
  );
}