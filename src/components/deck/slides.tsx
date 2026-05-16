import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AgentScene } from "./AgentViz";
import { Chip, ChipsWrap } from "./ChipStagger";
import { ProximaDashboard } from "./ProximaDashboard";
import { PlexusiaSlider } from "./PlexusiaSlider";

export type Slide = {
  eyebrow?: string;
  section?: number;
  render: () => ReactNode;
};

const Col = ({ label, children }: { label: string; children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="column-label">{label}</div>
    <div className="col-body">{children}</div>
  </motion.div>
);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export const slides: Slide[] = [
  {
    eyebrow: "Ouverture",
    section: 0,
    render: () => (
      <motion.div
        className="slide-contact slide-waiting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p className="waiting-label">La conférence commence bientôt</p>
        <motion.div className="contact-spacer" />
        <div className="contact-block">
          <div className="contact-name serif">Nathan Becheroy</div>
          <div className="contact-role">CEO, Proxima Nexus</div>
          <div className="contact-role muted">Activateur IA · France NUM</div>
          <div className="rule" />
          <div className="contact-line">+33 6 67 62 29 09</div>
          <div className="contact-line">nathan@proxima-nexus.com</div>
        </div>
      </motion.div>
    ),
  },
  {
    eyebrow: "I",
    section: 1,
    render: () => (
      <motion.div
        className="slide-title"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.div className="eyebrow" variants={fadeUp} transition={{ duration: 0.5 }}>
          Conférence · 2026 · ~1 h
        </motion.div>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }}>
          Du génératif <span className="muted">à</span> l'agentique
        </motion.h1>
        <motion.p className="lede lede-tight" variants={fadeUp} transition={{ duration: 0.5 }}>
          Plaidoirie pour une IA qui passe du texte à l'action.
        </motion.p>
        <motion.div className="rule" variants={fadeUp} />
        <motion.div className="byline" variants={fadeUp}>
          Nathan Becheroy · Proxima Nexus
        </motion.div>
        <motion.p className="deck-hint" variants={fadeUp}>
          F · plein écran · → pour avancer
        </motion.p>
      </motion.div>
    ),
  },
  {
    eyebrow: "II",
    section: 1,
    render: () => (
      <div className="split split-statement">
        <motion.h2
          className="serif"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          Le droit est entré dans l'ère de la machine qui rédige. Il doit
          maintenant accueillir la machine qui agit.
        </motion.h2>
        <div className="chips-stack">
          {[
            "ChatGPT, Claude, Mistral, Gemini",
            "Recherche, rédaction, synthèse",
            "Outils, mémoire, autonomie",
            "Du copilote à l'agent",
          ].map((label, i) => (
            <Chip key={label} index={i}>
              {label}
            </Chip>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "III",
    section: 1,
    render: () => (
      <motion.div className="slide-itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="serif center">Itinéraire · 4 actes</h2>
        <p className="itinerary-timing muted center">
          ~15 min par acte · démo live ~15 min
        </p>
        <div className="cards-row">
          {[
            ["I", "Ce que sait faire un LLM", "~12 min"],
            ["II", "Ce qu'il ne sait pas faire", "~12 min"],
            ["III", "L'agent et la mission", "~18 min"],
            ["IV", "Architectures et garde-fous", "~13 min"],
          ].map(([n, t, time], i) => (
            <motion.div
              key={n}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <span className="roman">{n}</span>
              <span className="card-title">{t}</span>
              <span className="card-time muted">{time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
  },
  {
    eyebrow: "Acte I",
    section: 2,
    render: () => (
      <div className="slide-section">
        <h2 className="serif center section-head">Ce que sait faire un LLM</h2>
        <div className="split split-top">
          <Col label="Forces">
            <ChipsWrap
              items={[
                "Comprendre un texte juridique",
                "Reformuler",
                "Synthétiser un dossier",
                "Rédiger un premier jet",
                "Comparer des clauses",
                "Traduire",
                "Extraire des éléments clés",
              ]}
            />
          </Col>
          <Col label="Limites">
            <ul>
              <li>Pas d'action sur le monde réel</li>
              <li>Pas de mémoire longue par défaut</li>
              <li>Pas de vérification autonome des sources</li>
              <li>Pas de responsabilité engagée</li>
            </ul>
          </Col>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Acte II",
    section: 3,
    render: () => (
      <motion.div className="slide-section slide-section--v-center">
        <motion.h2
          className="serif center section-head"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          L'agent : modèle + mission + outils + boucle
        </motion.h2>
        <motion.p
          className="lede center agent-lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Une mission explicite, des outils branchés, une mémoire de contexte —
          et une boucle qui agit jusqu'au livrable.
        </motion.p>
        <div className="chips-wrap chips-center">
          {["Percevoir", "Planifier", "Agir", "Observer", "Livrer"].map((c, i) => (
            <Chip key={c} index={i}>
              {c}
            </Chip>
          ))}
        </div>
      </motion.div>
    ),
  },
  {
    eyebrow: "Acte III",
    section: 4,
    render: () => (
      <motion.div className="stack-blocks">
        {[
          [
            "Recherche augmentée",
            [{ label: "Perplexity", href: "https://www.perplexity.ai" }],
          ],
          [
            "Agents autonomes",
            [
              { label: "Manus", href: "https://www.manus.im" },
              { label: "DeepAgent", href: "https://www.deepagent.ai" },
              { label: "Genspark", href: "https://www.genspark.ai" },
              { label: "Dust", href: "https://dust.tt" },
            ],
          ],
          [
            "Orchestration",
            [
              { label: "n8n", href: "https://n8n.io" },
              { label: "Make", href: "https://www.make.com" },
              {
                label: "Power Automate",
                href: "https://powerautomate.microsoft.com",
              },
            ],
          ],
        ].map(([label, chips], block) => (
          <motion.div
            key={label as string}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: block * 0.12, duration: 0.5 }}
          >
            <div className="column-label">{label as string}</div>
            <div className="chips-wrap chips-wrap-centered">
              {(chips as { label: string; href: string }[]).map((c, i) => (
                <Chip key={c.label} index={i + block * 2} href={c.href}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    ),
  },
  {
    eyebrow: "Démo",
    section: 4,
    render: () => (
      <motion.div
        className="center-block slide-demo"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="serif">Démonstration live</h2>
        <p className="lede">
          Plutôt que d&apos;en parler davantage, je vous propose qu&apos;on
          regarde un agent travailler.
        </p>
        <p className="demo-duration muted">~15 min réservées</p>
        <div className="chips-wrap chips-center">
          <Chip index={0}>Prendre</Chip>
          <Chip index={1}>Traiter</Chip>
          <Chip index={2}>Restituer</Chip>
        </div>
      </motion.div>
    ),
  },
  {
    eyebrow: "Acte III",
    section: 4,
    render: () => (
      <div className="split split-cols">
        <Col label="Agents prêts à l'emploi">
          <ChipsWrap
            className="chips-wrap chips-wrap-centered"
            items={["Veille", "Tri d'emails", "Synthèse de réunion"]}
          />
        </Col>
        <Col label="Agents construits avec n8n">
          <ChipsWrap
            className="chips-wrap chips-wrap-centered"
            items={["Onboarding client", "Suivi de procédure", "Reporting"]}
          />
        </Col>
      </div>
    ),
  },
  {
    eyebrow: "Acte III",
    section: 4,
    render: () => (
      <motion.div className="split split-agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="agent-viz solo">
          <AgentScene variant="solo" />
          <div className="column-label">Un agent</div>
        </div>
        <div className="agent-viz cluster">
          <AgentScene variant="cluster" />
          <div className="column-label">Multi-agents</div>
        </div>
      </motion.div>
    ),
  },
  {
    eyebrow: "Acte IV",
    section: 5,
    render: () => (
      <div className="slide-section">
        <h2 className="serif center section-head">Architectures émergentes</h2>
        <ChipsWrap
          items={[
            { label: "OpenClaw", href: "https://openclaw.ai/" },
            { label: "Hermes", href: "https://hermes-agent.nousresearch.com/" },
            { label: "Paperclip", href: "https://paperclip.ing/" },
            { label: "Pi", href: "https://pi.dev/" },
            "Stacks agentiques open source",
          ]}
          className="chips-wrap chips-center"
        />
        <motion.blockquote
          className="quote quote-compact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          « L'IA est la technologie la plus profonde sur laquelle l'humanité
          travaille. Plus profonde que le feu, l'électricité ou Internet. »
          <cite>Jensen Huang · NVIDIA</cite>
        </motion.blockquote>
      </div>
    ),
  },
  {
    eyebrow: "Acte IV",
    section: 5,
    render: () => (
      <div className="slide-section">
        <h2 className="serif center section-head">Garde-fous</h2>
        <div className="split split-top">
          <Col label="Gouvernance">
            <ul>
              <li>Secret professionnel & souveraineté des données</li>
              <li>HITL — validation humaine aux points critiques</li>
              <li>Traçabilité des décisions et des sources</li>
            </ul>
          </Col>
          <Col label="Conformité">
            <ChipsWrap
              items={["EU AI Act · art. 14", "Transparence", "Auditabilité", "Déploiement EU"]}
            />
          </Col>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Proxima OS",
    section: 5,
    render: () => (
      <div className="slide-proxima">
        <div className="proxima-header">
          <h2 className="serif">Proxima OS</h2>
          <p className="lede proxima-tagline">
            Votre équipe dirigeante, clé en main. Agents experts, mémoire
            persistante, souveraineté totale.
          </p>
        </div>
        <div className="split split-proxima">
          <ProximaDashboard />
          <div className="proxima-aside">
            <motion.div
              className="plexusia-avatar"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <PlexusiaSlider />
            </motion.div>
            <div className="plexusia-caption">
              <span className="column-label">Plexusia</span>
              <p className="muted">
                Votre jumeau numérique
                <br />
                co-fondatrice IA, stratégie, décisions
              </p>
            </div>
            <ChipsWrap
              className="chips-wrap chips-wrap-centered"
              items={[
                "Mémoire institutionnelle",
                "Orchestration multi-agents",
                "Infrastructure souveraine EU",
              ]}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Acte IV",
    section: 5,
    render: () => (
      <motion.div className="slide-section slide-legal">
        <div className="split split-top">
          <Col label="Cas d'usage · droit">
            <ChipsWrap
              className="chips-wrap chips-center"
              items={["Due diligence", "Veille réglementaire", "Pré-rédaction"]}
            />
          </Col>
          <Col label="Ce que vous pouvez faire lundi">
            <ul>
              <li>Cartographier un workflow à automatiser</li>
              <li>Tester un agent sur un dossier non sensible</li>
              <li>Documenter garde-fous & validation humaine</li>
            </ul>
          </Col>
        </div>
        <blockquote className="quote legal">
          « Le défi avec l'IA n'est pas seulement de la construire, mais de
          s'assurer qu'elle reste alignée avec nos valeurs. »
          <cite>Sam Altman · OpenAI</cite>
        </blockquote>
      </motion.div>
    ),
  },
  {
    eyebrow: "Merci",
    section: 0,
    render: () => (
      <div className="slide-contact slide-contact--close">
        <div className="contact-thanks serif">Merci.</div>
        <div className="contact-block">
          <div className="contact-name serif">Nathan Becheroy</div>
          <div className="contact-role">CEO, Proxima Nexus</div>
          <div className="contact-role muted">Activateur IA · France NUM</div>
          <div className="rule" />
          <div className="contact-line">+33 6 67 62 29 09</div>
          <div className="contact-line">nathan@proxima-nexus.com</div>
          <a
            className="contact-link"
            href="https://www.proxima-nexus.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.proxima-nexus.com
          </a>
        </div>
      </div>
    ),
  },
];

/** Nav sections aligned with Acte I–IV (slides 4–13), intro (1–3), bookends (0, 14) */
/** First slide where the hero GLB moves to the top-right corner */
export const CORNER_MODEL_FROM_SLIDE = 3;

export const slideSections = [
  { label: "·", start: 0, end: 0 },
  { label: "—", start: 1, end: 3 },
  { label: "I", start: 4, end: 4 },
  { label: "II", start: 5, end: 5 },
  { label: "III", start: 6, end: 9 },
  { label: "IV", start: 10, end: 13 },
  { label: "·", start: 14, end: 14 },
];
