import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene } from "./Scene";
import { slides, slideSections, CORNER_MODEL_FROM_SLIDE } from "./slides";
import "./deck.css";

import { assetUrl } from "@/lib/assets";

const INTRO_OUTRO_TRACK = assetUrl("intro-outro.mp3");

export function Deck() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundtrackWantedRef = useRef(false);

  const playSoundtrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {});
  }, []);

  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, n));
      setDir(next > i ? 1 : -1);
      setI(next);
      if (next === 0 || next === slides.length - 1) {
        soundtrackWantedRef.current = true;
        queueMicrotask(playSoundtrack);
      }
    },
    [i, playSoundtrack],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".proxima-dash-interactive")) {
        if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight") return;
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(i + 1);
      } else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  useEffect(() => {
    let startX = 0;
    const ts = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
    };
    window.addEventListener("touchstart", ts);
    window.addEventListener("touchend", te);
    return () => {
      window.removeEventListener("touchstart", ts);
      window.removeEventListener("touchend", te);
    };
  }, [i, go]);

  const current = slides[i];
  const progress = ((i + 1) / slides.length) * 100;
  const isOpening = i === 0;
  const isClosing = i === slides.length - 1;

  useEffect(() => {
    soundtrackWantedRef.current = isOpening || isClosing;
    if (!soundtrackWantedRef.current) {
      audioRef.current?.pause();
      return;
    }
    playSoundtrack();
    return () => audioRef.current?.pause();
  }, [i, isOpening, isClosing, playSoundtrack]);

  useEffect(() => {
    const unlock = () => {
      if (soundtrackWantedRef.current) playSoundtrack();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [playSoundtrack]);
  const proximaSlide = current.eyebrow === "Proxima OS";
  const activeSection = slideSections.findIndex((s) => i >= s.start && i <= s.end);
  const modelPlacement = isOpening
    ? "center"
    : isClosing
      ? "top"
      : i >= CORNER_MODEL_FROM_SLIDE
        ? "corner"
        : "side";

  return (
    <div className="deck-root">
      <audio
        ref={audioRef}
        className="deck-soundtrack"
        src={INTRO_OUTRO_TRACK}
        loop
        preload="auto"
        aria-hidden
      />
      <Scene slideIndex={i} modelPlacement={modelPlacement} />
      <div className="deck-progress" style={{ width: `${progress}%` }} />
      <div className="deck-eyebrow-fixed">{current.eyebrow}</div>
      <div className="deck-brand-fixed">Proxima Nexus</div>

      <div
        className={`deck-stage deck-perspective${proximaSlide ? " deck-stage--compact" : ""}${modelPlacement === "corner" ? " deck-stage--model-corner" : ""}`}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            className="deck-slide deck-slide-3d"
            custom={dir}
            initial={{
              opacity: 0,
              rotateY: 35 * dir,
              rotateX: -8,
              z: -400,
              y: 40 * dir,
              filter: "blur(14px)",
            }}
            animate={{
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              z: 0,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              rotateY: -35 * dir,
              rotateX: 8,
              z: -400,
              y: -40 * dir,
              filter: "blur(14px)",
            }}
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {current.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="deck-nav" role="navigation">
        <button type="button" onClick={() => go(i - 1)} aria-label="Précédent">
          ‹
        </button>
        <div className="deck-sections" aria-label="Sections">
          {slideSections.map((sec, idx) => (
            <span key={`${sec.label}-${idx}`}>
              {idx > 0 && idx < slideSections.length - 1 && (
                <span className="deck-section-sep" aria-hidden />
              )}
              <button
                type="button"
                className={`deck-section-btn${activeSection === idx ? " active" : ""}`}
                aria-label={
                  sec.label === "—"
                    ? "Introduction"
                    : sec.label === "·"
                      ? i === 0
                        ? "Ouverture"
                        : "Fin"
                      : `Acte ${sec.label}`
                }
                aria-current={activeSection === idx ? "true" : undefined}
                onClick={() => go(sec.start)}
              >
                {sec.label}
              </button>
            </span>
          ))}
        </div>
        <div className="deck-dots">
          {slides.map((_, n) => (
            <button
              key={n}
              type="button"
              className={`deck-dot ${n === i ? "active" : ""}`}
              aria-label={`Slide ${n + 1}`}
              onClick={() => go(n)}
            />
          ))}
        </div>
        <span className="deck-counter" aria-live="polite">
          {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => go(i + 1)} aria-label="Suivant">
          ›
        </button>
      </div>
    </div>
  );
}
