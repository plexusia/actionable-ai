import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl } from "@/lib/assets";

const POSES = [
  { src: assetUrl("Plexy_call_me.png"), alt: "Plexusia — Digital Twin" },
  { src: assetUrl("Plexy_ok_gesture.png"), alt: "Plexusia — geste OK" },
  { src: assetUrl("Plexy_pointing.png"), alt: "Plexusia — présentation" },
  { src: assetUrl("Plexy_thumbs_up.png"), alt: "Plexusia — validation" },
  { src: assetUrl("Plexy_victory_sign.png"), alt: "Plexusia — victoire" },
] as const;

const INTERVAL_MS = 3200;

export function PlexusiaSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % POSES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="plexusia-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={POSES[index].src}
          src={POSES[index].src}
          alt={POSES[index].alt}
          className="plexusia-slider-img"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}
