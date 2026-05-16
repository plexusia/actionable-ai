import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState, type ReactNode } from "react";
import * as THREE from "three";
import { ModernAgentCore, MultiAgentAura } from "./ModernAgentAura";

const ACCENT = "#9bb0c4";
/** Rayon effectif du cluster (orbite + halos agents/sous-agents) */
const CLUSTER_VIEW_RADIUS = 3.55;
const CLUSTER_CAMERA_MARGIN = 1.02;

type AgentVizVariant = "solo" | "cluster";

function useCanvasDpr() {
  const [dpr, setDpr] = useState(2);
  useEffect(() => {
    const update = () => setDpr(Math.min(window.devicePixelRatio * 1.5, 3.5));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return dpr;
}

function GlDprSync({ dpr }: { dpr: number }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(dpr);
  }, [gl, dpr]);
  return null;
}

function SceneFit({ variant }: { variant: AgentVizVariant }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    if (variant === "cluster") {
      const vFov = (camera.fov * Math.PI) / 180;
      const aspect = size.width > 0 && size.height > 0 ? size.width / size.height : 1;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const distV = CLUSTER_VIEW_RADIUS / Math.sin(vFov / 2);
      const distH = CLUSTER_VIEW_RADIUS / Math.sin(hFov / 2);
      const z = CLUSTER_CAMERA_MARGIN * Math.max(distV, distH);
      camera.position.set(0, 0, z);
      camera.fov = 54;
      camera.near = 0.1;
      camera.far = 40;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      return;
    }
    camera.position.set(0, 0.12, 6.4);
    camera.fov = 42;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, variant, size.width, size.height]);
  return null;
}

/** Force le canvas WebGL à remplir le cadre carré (évite le décalage de taille R3F) */
function CanvasResizeSync() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const container = gl.domElement.closest(".agent-viz-viewport");
    if (!(container instanceof HTMLElement)) return;

    const sync = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      gl.setSize(width, height, false);
      invalidate();
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);
    return () => ro.disconnect();
  }, [gl, invalidate]);
  return null;
}

function AgentCanvas({
  children,
  variant,
}: {
  children: ReactNode;
  variant: AgentVizVariant;
}) {
  const dpr = useCanvasDpr();
  const camera =
    variant === "cluster"
      ? { position: [0, 0, 7.6] as const, fov: 54, near: 0.1, far: 40 }
      : { position: [0, 0.12, 6.4] as const, fov: 42, near: 0.1, far: 30 };

  return (
    <div className="agent-viz-viewport">
      <Canvas
        className="agent-viz-canvas"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        camera={camera}
        dpr={dpr}
        resize={{ scroll: false, debounce: { resize: 0, scroll: 0 } }}
        gl={{
          alpha: true,
          premultipliedAlpha: true,
          antialias: true,
          powerPreference: "default",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(dpr);
          gl.toneMapping = THREE.ReinhardToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <SceneFit variant={variant} />
        <CanvasResizeSync />
        <GlDprSync dpr={dpr} />
        <ambientLight color={0x222a52} intensity={0.55} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} color={0xffffff} />
        <pointLight position={[-2, 1, -3]} intensity={0.55} color={0x4488cc} />
        <pointLight position={[1.5, 1, 2]} intensity={0.45} color={0xffaa66} />
        <pointLight position={[1, 1, 2]} intensity={0.65} color={ACCENT} />
        {children}
      </Canvas>
    </div>
  );
}

function SoloAgent() {
  return <ModernAgentCore scale={0.7} />;
}

function ClusterAgents() {
  return <MultiAgentAura />;
}

export function AgentScene({ variant }: { variant: AgentVizVariant }) {
  return (
    <div className={`agent-viz-frame agent-viz-frame--${variant}`}>
      <AgentCanvas variant={variant}>
        {variant === "solo" ? <SoloAgent /> : <ClusterAgents />}
      </AgentCanvas>
    </div>
  );
}
