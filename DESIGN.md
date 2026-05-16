---
version: alpha
name: Actionable AI — Conférence
description: Deck conférence 1h — dark editorial, accent froid, serif + sans.
colors:
  primary: "#f2f2f0"
  secondary: "#c9c9cf"
  tertiary: "#9bb0c4"
  neutral: "#050509"
  muted: "#8a8a92"
  hint: "#5a5a62"
  accent-soft: "#cfd8e3"
  surface: "rgba(255,255,255,0.025)"
  border: "rgba(255,255,255,0.10)"
  bg-start: "#111118"
  bg-end: "#050509"
typography:
  display:
    fontFamily: DM Serif Display
    fontSize: 96px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.02em
  headline:
    fontFamily: DM Serif Display
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 300
    lineHeight: 1.55
  lede:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: 300
    lineHeight: 1.4
  quote:
    fontFamily: DM Serif Display
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.35
  eyebrow:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.22em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.25em
rounded:
  sm: 4px
  md: 12px
  full: 999px
spacing:
  stage-y: 10vh
  stage-x: 8vw
  max-width: 1400px
  grid-gap: 3vw
  card-gap: 20px
components:
  deck-background:
    backgroundColor: "{colors.bg-start}"
  deck-text-primary:
    textColor: "{colors.primary}"
  deck-accent:
    textColor: "{colors.tertiary}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.full}"
---

Dark fullscreen deck for **Du génératif à l'agentique** (1h). Cool accent on roman numerals, chips, progress. Serif headlines, Inter body. Heavy 3D transitions retained.
