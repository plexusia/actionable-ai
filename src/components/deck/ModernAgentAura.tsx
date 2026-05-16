import { useRef, useMemo, type MutableRefObject, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Agent aura palette */
const CORE_COLOR = 0x4a866c;
const CORE_EMISSIVE = 0x112233;
const WIREFRAME_COLOR = 0x6699ff;
const TORUS_A = 0x8888ff;
const TORUS_B = 0xffaacc;
const BRANCH_COLOR = 0x88ccff;

function buildRingParticles(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = 0.35 * Math.sin(3 * t);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    colors[i * 3] = 0.4 + 0.6 * Math.sin(t);
    colors[i * 3 + 1] = 0.3 + 0.7 * Math.cos(1.7 * t);
    colors[i * 3 + 2] = 0.8 + 0.2 * Math.sin(2.3 * t);
  }
  return { positions, colors };
}

/** Single agent aura — ported from modern-visual (sans nuage ambiant) */
export function ModernAgentCore({
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
  phaseOffset = 0,
  isOrchestrator = false,
}: {
  scale?: number;
  position?: [number, number, number];
  phaseOffset?: number;
  isOrchestrator?: boolean;
}) {
  const core = useRef<THREE.Mesh>(null!);
  const wire = useRef<THREE.Mesh>(null!);
  const ringPts = useRef<THREE.Points>(null!);
  const torus1 = useRef<THREE.Mesh>(null!);
  const torus2 = useRef<THREE.Mesh>(null!);

  const ringData = useMemo(
    () => buildRingParticles(isOrchestrator ? 1400 : 1200, isOrchestrator ? 1.7 : 1.55),
    [isOrchestrator],
  );
  const coreColor = isOrchestrator ? 0x6a9a8c : CORE_COLOR;
  const emissive = isOrchestrator ? 0x334455 : CORE_EMISSIVE;
  const emissiveIntensity = isOrchestrator ? 0.85 : 0;

  useFrame((state) => {
    const time = state.clock.elapsedTime + phaseOffset;
    if (core.current && wire.current) {
      core.current.rotation.y = 0.25 * time;
      core.current.rotation.x = 0.2 * Math.sin(0.37 * time);
      core.current.rotation.z = 0.15 * Math.cos(0.23 * time);
      wire.current.rotation.copy(core.current.rotation);
    }
    if (ringPts.current) {
      ringPts.current.rotation.y = 0.35 * time;
      ringPts.current.rotation.x = 0.2 * Math.sin(0.28 * time);
    }
    if (torus1.current) {
      torus1.current.rotation.x = Math.PI / 2;
      torus1.current.rotation.z = 0.5 * time;
    }
    if (torus2.current) {
      torus2.current.rotation.x = Math.PI / 2 + 0.3;
      torus2.current.rotation.z = 0.65 * time;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissive}
          emissiveIntensity={isOrchestrator ? emissiveIntensity : 0}
          roughness={0.28}
          metalness={0.75}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={wire} scale={1.08}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color={WIREFRAME_COLOR} wireframe transparent opacity={0.25} />
      </mesh>

      <points ref={ringPts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ringData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <mesh ref={torus1}>
        <torusGeometry args={[1.45, 0.045, 64, 500]} />
        <meshStandardMaterial
          color={TORUS_A}
          emissive={0x225522}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh ref={torus2}>
        <torusGeometry args={[1.68, 0.03, 64, 500]} />
        <meshStandardMaterial
          color={TORUS_B}
          emissive={0x444422}
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

/** Sous-agent — version allégée (position = parent orbital group) */
function SubAgentCore({
  scale = 0.2,
  phaseOffset = 0,
}: {
  scale?: number;
  phaseOffset?: number;
}) {
  const core = useRef<THREE.Mesh>(null!);
  const wire = useRef<THREE.Mesh>(null!);
  const ringPts = useRef<THREE.Points>(null!);
  const ringData = useMemo(() => buildRingParticles(500, 1.05), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + phaseOffset;
    if (core.current && wire.current) {
      core.current.rotation.y = 0.3 * time;
      core.current.rotation.x = 0.15 * Math.sin(0.4 * time);
      wire.current.rotation.copy(core.current.rotation);
    }
    if (ringPts.current) ringPts.current.rotation.y = 0.4 * time;
  });

  return (
    <group scale={scale}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={0x5a7a6e}
          emissive={0x1a2a33}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.7}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh ref={wire} scale={1.06}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color={WIREFRAME_COLOR} wireframe transparent opacity={0.18} />
      </mesh>
      <points ref={ringPts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ringData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.028, 32, 200]} />
        <meshStandardMaterial color={TORUS_A} emissive={0x112233} roughness={0.4} metalness={0.85} />
      </mesh>
    </group>
  );
}

/** Électron de tâche — suit des cibles mobiles */
function TaskElectron({
  getFrom,
  getTo,
  speed = 0.38,
  offset = 0,
  size = 0.045,
}: {
  getFrom: () => THREE.Vector3;
  getTo: () => THREE.Vector3;
  speed?: number;
  offset?: number;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * speed + offset) % 1;
    const ease = 1 - Math.pow(1 - t, 2.2);
    origin.copy(getFrom());
    target.copy(getTo());
    pos.lerpVectors(origin, target, ease);
    ref.current?.position.copy(pos);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={0xcceeff} transparent opacity={0.95} depthWrite={false} />
    </mesh>
  );
}

const ORCHESTRATOR = {
  scale: 0.68,
  phase: 0,
};

type NestAgentConfig = {
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  planeNormal: THREE.Vector3;
  subOrbitRadius: number;
  subOrbitSpeed: number;
  scale: number;
  phase: number;
};

const MAIN_AGENT_COUNT = 7;
/** Écart angulaire entre plans orbitaux consécutifs (modèle « électrons autour du noyau ») */
const PLANE_ANGLE_STEP = (50 * Math.PI) / 180;
/** Inclinaison du cône de normales — plans non coplanaires */
const ORBIT_INCLINATION = (58 * Math.PI) / 180;
/** Distance commune orchestrateur → agent principal */
const MAIN_ORBIT_RADIUS = 2.5;

function buildPlaneNormal(index: number) {
  const a = index * PLANE_ANGLE_STEP;
  const incl = ORBIT_INCLINATION;
  return new THREE.Vector3(
    Math.sin(incl) * Math.sin(a),
    Math.cos(incl),
    Math.sin(incl) * Math.cos(a),
  ).normalize();
}

/** 7 agents — même rayon, plans espacés de 50° autour de l’orchestrateur */
function buildNestAgents(): NestAgentConfig[] {
  const count = MAIN_AGENT_COUNT;

  return Array.from({ length: count }, (_, i) => {
    return {
      orbitAngle: (i / count) * Math.PI * 2 - Math.PI / 2,
      orbitRadius: MAIN_ORBIT_RADIUS,
      orbitSpeed: 0.14 + (i % 3) * 0.012,
      planeNormal: buildPlaneNormal(i),
      subOrbitRadius: 0.48,
      subOrbitSpeed: 0.4 + i * 0.025,
      scale: 0.36,
      phase: (i / count) * Math.PI * 2,
    };
  });
}

const TEAM_MEMBERS = buildNestAgents();

const DEFAULT_PLANE_NORMAL = new THREE.Vector3(0, 1, 0);

/** Oriente le plan local XZ pour que sa normale = planeNormal (centre = origine du parent) */
function OrbitPlane({
  planeNormal,
  children,
}: {
  planeNormal: THREE.Vector3;
  children: ReactNode;
}) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(DEFAULT_PLANE_NORMAL, planeNormal.clone().normalize());
    return q;
  }, [planeNormal.x, planeNormal.y, planeNormal.z]);

  return <group quaternion={quaternion}>{children}</group>;
}

/** Anneau orbital (guide visuel, centré sur l’orchestrateur dans le plan local XZ) */
function OrbitGuide({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 72;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <line loop geometry={geometry}>
      <lineBasicMaterial color={BRANCH_COLOR} transparent opacity={0.14} depthWrite={false} />
    </line>
  );
}

function MemberAgent({
  config,
  memberRef,
  subRef,
}: {
  config: NestAgentConfig;
  memberRef: (el: THREE.Group | null) => void;
  subRef: (el: THREE.Group | null) => void;
}) {
  const carrier = useRef<THREE.Group>(null!);
  const subOrbit = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = config.orbitAngle + t * config.orbitSpeed;
    if (carrier.current) {
      carrier.current.position.set(
        Math.cos(a) * config.orbitRadius,
        0,
        Math.sin(a) * config.orbitRadius,
      );
    }
    const sa = config.phase + t * config.subOrbitSpeed;
    if (subOrbit.current) {
      subOrbit.current.position.set(
        Math.cos(sa) * config.subOrbitRadius,
        0.1 + Math.sin(sa * 1.35) * 0.06,
        Math.sin(sa) * config.subOrbitRadius * 0.72,
      );
    }
  });

  return (
    <group
      ref={(el) => {
        carrier.current = el;
        memberRef(el);
      }}
    >
      <ModernAgentCore scale={config.scale} phaseOffset={config.phase} />
      <group
        ref={(el) => {
          subOrbit.current = el;
          subRef(el);
        }}
      >
        <SubAgentCore scale={0.18} phaseOffset={config.phase + 0.8} />
      </group>
    </group>
  );
}

/** Liens orchestrateur → agents → sous-agents (mis à jour chaque frame) */
function DelegationNetwork({
  orchRef,
  memberRefs,
  subRefs,
}: {
  orchRef: MutableRefObject<THREE.Group | null>;
  memberRefs: MutableRefObject<(THREE.Group | null)[]>;
  subRefs: MutableRefObject<(THREE.Group | null)[]>;
}) {
  const mainRef = useRef<THREE.LineSegments>(null!);
  const subLineRef = useRef<THREE.LineSegments>(null!);
  const wp = useMemo(() => new THREE.Vector3(), []);
  const op = useMemo(() => new THREE.Vector3(), []);
  const mainBuf = useMemo(() => new Float32Array(TEAM_MEMBERS.length * 6), []);
  const subBuf = useMemo(() => new Float32Array(TEAM_MEMBERS.length * 6), []);

  useFrame(() => {
    let mi = 0;
    let si = 0;
    for (let i = 0; i < TEAM_MEMBERS.length; i++) {
      const member = memberRefs.current[i];
      const sub = subRefs.current[i];
      const orch = orchRef.current;
      if (member && orch) {
        orch.getWorldPosition(op);
        member.getWorldPosition(wp);
        mainBuf[mi++] = op.x;
        mainBuf[mi++] = op.y;
        mainBuf[mi++] = op.z;
        mainBuf[mi++] = wp.x;
        mainBuf[mi++] = wp.y;
        mainBuf[mi++] = wp.z;
      }
      if (member && sub) {
        member.getWorldPosition(op);
        sub.getWorldPosition(wp);
        subBuf[si++] = op.x;
        subBuf[si++] = op.y;
        subBuf[si++] = op.z;
        subBuf[si++] = wp.x;
        subBuf[si++] = wp.y;
        subBuf[si++] = wp.z;
      }
    }
    const mainGeo = mainRef.current?.geometry;
    const subGeo = subLineRef.current?.geometry;
    if (mainGeo) {
      (mainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (subGeo) {
      (subGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  const mainGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(mainBuf, 3));
    g.attributes.position.setUsage(THREE.DynamicDrawUsage);
    return g;
  }, [mainBuf]);

  const subGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(subBuf, 3));
    g.attributes.position.setUsage(THREE.DynamicDrawUsage);
    return g;
  }, [subBuf]);

  return (
    <>
      <lineSegments ref={mainRef} geometry={mainGeo}>
        <lineBasicMaterial color={BRANCH_COLOR} transparent opacity={0.48} />
      </lineSegments>
      <lineSegments ref={subLineRef} geometry={subGeo}>
        <lineBasicMaterial color={0x99bbdd} transparent opacity={0.3} />
      </lineSegments>
    </>
  );
}

/** Multi-agents : orbites imbriquées + délégation dynamique */
export function MultiAgentAura() {
  const memberRefs = useRef<(THREE.Group | null)[]>([]);
  const subRefs = useRef<(THREE.Group | null)[]>([]);
  const orchRef = useRef<THREE.Group | null>(null);
  const makeGetMemberPos = (i: number) => () => {
    const v = new THREE.Vector3();
    memberRefs.current[i]?.getWorldPosition(v);
    return v;
  };
  const makeGetSubPos = (i: number) => () => {
    const v = new THREE.Vector3();
    subRefs.current[i]?.getWorldPosition(v);
    return v;
  };
  const getOrchPos = () => {
    const v = new THREE.Vector3();
    orchRef.current?.getWorldPosition(v);
    return v;
  };

  return (
    <group>
      {/* Noyau : origine commune de toutes les orbites principales */}
      <group ref={orchRef}>
        <ModernAgentCore
          scale={ORCHESTRATOR.scale}
          phaseOffset={ORCHESTRATOR.phase}
          isOrchestrator
        />
      </group>

      {TEAM_MEMBERS.map((config, i) => (
        <OrbitPlane key={i} planeNormal={config.planeNormal}>
          <OrbitGuide radius={config.orbitRadius} />
          <MemberAgent
            config={config}
            memberRef={(el) => {
              memberRefs.current[i] = el;
            }}
            subRef={(el) => {
              subRefs.current[i] = el;
            }}
          />
        </OrbitPlane>
      ))}

      <DelegationNetwork orchRef={orchRef} memberRefs={memberRefs} subRefs={subRefs} />

      {TEAM_MEMBERS.map((_, i) => (
        <TaskElectron
          key={`orch-${i}`}
          getFrom={getOrchPos}
          getTo={makeGetMemberPos(i)}
          speed={0.34 + (i % 4) * 0.03}
          offset={i * 0.14}
        />
      ))}

      {TEAM_MEMBERS.map((_, i) => (
        <TaskElectron
          key={`sub-${i}`}
          getFrom={makeGetMemberPos(i)}
          getTo={makeGetSubPos(i)}
          speed={0.4 + i * 0.025}
          offset={i * 0.18 + 0.1}
          size={0.028}
        />
      ))}
    </group>
  );
}
