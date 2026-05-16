import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene } from "./Scene";
import { slides, slideSections, CORNER_MODEL_FROM_SLIDE } from "./slides";
import "./deck.css";

import { assetUrl } from "@/lib/assets";

const INTRO_OUTRO_TRACK = assetUrl("intro-outro.mp3");
const SOUNDTRACK_SLIDES = new Set([0, slides.length - 1]);

export function Deck() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  /** Must run synchronously inside a click/key handler (browser autoplay policy). */
  const startSoundtrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      void playPromise
        .then(() => setSoundPlaying(true))
        .catch(() => setSoundPlaying(false));
    }
  }, []);

  const stopSoundtrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setSoundPlaying(false);
  }, []);

  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(slides.length - 1, n));
      setDir(next > i ? 1 : -1);
      setI(next);
      if (SOUNDTRACK_SLIDES.has(next)) {
        startSoundtrack();
      } else {
        stopSoundtrack();
      }
    },
    [i, startSoundtrack, stopSoundtrack],
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
    if (!isOpening && !isClosing) stopSoundtrack();
  }, [i, isOpening, isClosing, stopSoundtrack]);

  const proximaSlide = current.eyebrow === "Proxima OS";
  const showSoundtrack = isOpening || isClosing;
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
        playsInline
        onPlaying={() => setSoundPlaying(true)}
        onPause={() => setSoundPlaying(false)}
        onEnded={() => setSoundPlaying(false)}
        aria-hidden
      />
      {showSoundtrack && (
        <button
          type="button"
          className={`deck-sound-btn${soundPlaying ? " deck-sound-btn--on" : ""}`}
          aria-pressed={soundPlaying}
          aria-label={soundPlaying ? "Couper la bande-son" : "Activer la bande-son"}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (soundPlaying) stopSoundtrack();
            else startSoundtrack();
          }}
        >
          {soundPlaying ? "Son activé" : "Activer le son"}
        </button>
      )}
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
