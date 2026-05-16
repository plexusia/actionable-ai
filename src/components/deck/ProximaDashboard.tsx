import { useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "briefing" | "decisions" | "metrics";
type AgentId = "Plexusia" | "CFO" | "CBO" | "CPO";
type AgentFilter = "all" | AgentId;

type BriefItem = {
  id: string;
  agent: AgentId;
  tag: string;
  time: string;
  text: string;
  detail: string;
  priority: "haute" | "moyenne";
};

type Decision = {
  id: string;
  agent: AgentId;
  title: string;
  context: string;
  reversibility: "haute" | "moyenne" | "basse";
  status: "pending" | "approved" | "deferred";
};

const AGENTS: AgentId[] = ["Plexusia", "CFO", "CBO", "CPO"];

const INITIAL_BRIEFS: BriefItem[] = [
  {
    id: "b1",
    agent: "Plexusia",
    tag: "Digital Twin",
    time: "08:12",
    text: "Trois décisions vous attendent — classées par réversibilité.",
    detail:
      "Priorité : appel pricing 10h30. Les deux autres décisions (recrutement, partenariat) peuvent attendre après midi.",
    priority: "haute",
  },
  {
    id: "b2",
    agent: "CFO",
    tag: "Finance",
    time: "08:30",
    text: "Trésorerie à 14,2 mois. Facturation septembre +38 k€ vs prévision.",
    detail: "Recommandation : réallouer 8 k€ vers recrutement produit — ROI projeté à 18 mois.",
    priority: "moyenne",
  },
  {
    id: "b3",
    agent: "CBO",
    tag: "Business",
    time: "09:05",
    text: "Partenaire stratégique — pilote co-selling Q1. Brief prêt.",
    detail: "Intégrateur mid-market, 30 min cette semaine. Dossier synthétisé en pièce jointe.",
    priority: "haute",
  },
  {
    id: "b4",
    agent: "CPO",
    tag: "Product",
    time: "09:48",
    text: "Dérive roadmap : module agents +12 j. Deux items reportables.",
    detail: "Scope « analytics v2 » et « export PDF » reportables sans impact sur le launch Q1.",
    priority: "moyenne",
  },
];

const INITIAL_DECISIONS: Decision[] = [
  {
    id: "d1",
    agent: "Plexusia",
    title: "Valider la nouvelle grille tarifaire",
    context: "Impact MRR +12 % estimé · réversible sous 30 jours",
    reversibility: "moyenne",
    status: "pending",
  },
  {
    id: "d2",
    agent: "CFO",
    title: "Réallocation budget recrutement",
    context: "8 k€/mois · aligné sur clôture septembre",
    reversibility: "haute",
    status: "pending",
  },
  {
    id: "d3",
    agent: "CBO",
    title: "Lancer le pilote co-selling Q1",
    context: "Contrat cadre 12 mois · clause de sortie à 90 jours",
    reversibility: "basse",
    status: "pending",
  },
];

const METRICS = [
  { label: "Trésorerie", value: "14,2 mois", trend: "+1,1", pct: 78 },
  { label: "MRR", value: "€42 k", trend: "+8 %", pct: 65 },
  { label: "Décisions actives", value: "3", trend: "−2", pct: 40, dynamic: true },
  { label: "Agents actifs", value: "4/4", trend: "100 %", pct: 100 },
];

const TAB_PATH: Record<Tab, string> = {
  briefing: "briefing",
  decisions: "decisions",
  metrics: "metrics",
};

export function ProximaDashboard() {
  const [tab, setTab] = useState<Tab>("briefing");
  const [agentFilter, setAgentFilter] = useState<AgentFilter>("all");
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [metricPeriod, setMetricPeriod] = useState<"7j" | "30j" | "90j">("30j");

  const pendingCount = decisions.filter((d) => d.status === "pending").length;

  const filteredBriefs = useMemo(
    () =>
      INITIAL_BRIEFS.filter((b) => agentFilter === "all" || b.agent === agentFilter),
    [agentFilter],
  );

  const filteredDecisions = useMemo(
    () =>
      decisions.filter((d) => agentFilter === "all" || d.agent === agentFilter),
    [decisions, agentFilter],
  );

  const setDecisionStatus = useCallback(
    (id: string, status: Decision["status"]) => {
      setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    },
    [],
  );

  const stopDeckKeys = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key.startsWith("Arrow")) e.stopPropagation();
  };

  return (
    <motion.div
      className="proxima-dash proxima-dash-interactive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      onKeyDown={stopDeckKeys}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="proxima-dash-chrome">
        <div className="proxima-dash-url">
          <span className="proxima-dash-dot" />
          proxima.os / {TAB_PATH[tab]}
        </div>
        <span className="proxima-dash-live">Interactif</span>
      </div>

      <div className="proxima-dash-tabs" role="tablist">
        {(
          [
            ["briefing", "Briefing"],
            ["decisions", "Décisions"],
            ["metrics", "Métriques"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`proxima-dash-tab${tab === id ? " active" : ""}`}
            onClick={() => {
              setTab(id);
              setSelectedBriefId(null);
            }}
          >
            {label}
            {id === "decisions" && pendingCount > 0 && (
              <span className="proxima-dash-tab-badge">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="proxima-dash-body">
        <AnimatePresence mode="wait">
          {tab === "briefing" && (
            <motion.div
              key="briefing"
              className="proxima-dash-panel"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="proxima-dash-hero">
                <div>
                  <p className="proxima-dash-hero-label">Briefing quotidien</p>
                  <p className="proxima-dash-hero-title">Aujourd&apos;hui</p>
                </div>
                <span className="proxima-dash-badge">{pendingCount} en attente</span>
              </div>

              <div className="proxima-dash-feed">
                {filteredBriefs.map((b) => (
                  <article
                    key={b.id}
                    className={`proxima-dash-card proxima-dash-card--clickable${selectedBriefId === b.id ? " selected" : ""}`}
                    onClick={() =>
                      setSelectedBriefId((id) => (id === b.id ? null : b.id))
                    }
                  >
                    <div className="proxima-dash-card-head">
                      <div>
                        <span className="proxima-dash-card-role">{b.agent}</span>
                        <span className="proxima-dash-card-tag">{b.tag}</span>
                        <span
                          className={`proxima-dash-priority proxima-dash-priority--${b.priority}`}
                        >
                          {b.priority}
                        </span>
                      </div>
                      <span className="proxima-dash-card-time">{b.time}</span>
                    </div>
                    <p className="proxima-dash-card-text">{b.text}</p>
                    <AnimatePresence>
                      {selectedBriefId === b.id && (
                        <motion.div
                          className="proxima-dash-card-detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p>{b.detail}</p>
                          <button
                            type="button"
                            className="proxima-dash-btn proxima-dash-btn--ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTab("decisions");
                            }}
                          >
                            Voir les décisions liées →
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "decisions" && (
            <motion.div
              key="decisions"
              className="proxima-dash-panel"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="proxima-dash-hero">
                <div>
                  <p className="proxima-dash-hero-label">File de décision</p>
                  <p className="proxima-dash-hero-title">À trancher</p>
                </div>
              </div>

              <div className="proxima-dash-feed">
                {filteredDecisions.length === 0 ? (
                  <p className="proxima-dash-empty">Toutes les décisions sont traitées.</p>
                ) : (
                  filteredDecisions.map((d) => (
                    <article
                      key={d.id}
                      className={`proxima-dash-card proxima-dash-decision proxima-dash-decision--${d.status}`}
                    >
                      <div className="proxima-dash-card-head">
                        <div>
                          <span className="proxima-dash-card-role">{d.agent}</span>
                          <span
                            className={`proxima-dash-rev proxima-dash-rev--${d.reversibility}`}
                          >
                            rév. {d.reversibility}
                          </span>
                        </div>
                        {d.status !== "pending" && (
                          <span className={`proxima-dash-status proxima-dash-status--${d.status}`}>
                            {d.status === "approved" ? "Validé" : "Reporté"}
                          </span>
                        )}
                      </div>
                      <p className="proxima-dash-decision-title">{d.title}</p>
                      <p className="proxima-dash-card-text">{d.context}</p>
                      {d.status === "pending" && (
                        <div className="proxima-dash-actions">
                          <button
                            type="button"
                            className="proxima-dash-btn proxima-dash-btn--primary"
                            onClick={() => setDecisionStatus(d.id, "approved")}
                          >
                            Valider
                          </button>
                          <button
                            type="button"
                            className="proxima-dash-btn proxima-dash-btn--ghost"
                            onClick={() => setDecisionStatus(d.id, "deferred")}
                          >
                            Reporter
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {tab === "metrics" && (
            <motion.div
              key="metrics"
              className="proxima-dash-panel"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="proxima-dash-hero proxima-dash-hero--metrics">
                <div>
                  <p className="proxima-dash-hero-label">Cockpit</p>
                  <p className="proxima-dash-hero-title">Métriques</p>
                </div>
                <div className="proxima-dash-period" role="group" aria-label="Période">
                  {(["7j", "30j", "90j"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`proxima-dash-period-btn${metricPeriod === p ? " active" : ""}`}
                      onClick={() => setMetricPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="proxima-dash-metrics">
                {METRICS.map((m) => {
                  const pct =
                    m.dynamic && m.label === "Décisions actives"
                      ? Math.round((pendingCount / 3) * 100)
                      : m.pct;
                  const value =
                    m.dynamic && m.label === "Décisions actives"
                      ? String(pendingCount)
                      : m.value;
                  return (
                    <div key={m.label} className="proxima-dash-metric">
                      <div className="proxima-dash-metric-head">
                        <span className="proxima-dash-metric-label">{m.label}</span>
                        <span className="proxima-dash-metric-trend">{m.trend}</span>
                      </div>
                      <span className="proxima-dash-metric-value">{value}</span>
                      <motion.div className="proxima-dash-metric-bar">
                        <motion.div
                          className="proxima-dash-metric-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                          key={`${m.label}-${metricPeriod}-${pct}`}
                        />
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              <div className="proxima-dash-chart">
                <p className="proxima-dash-chart-label">Activité agents · {metricPeriod}</p>
                <div className="proxima-dash-chart-bars">
                  {AGENTS.map((a, i) => (
                    <button
                      key={a}
                      type="button"
                      className={`proxima-dash-chart-col${agentFilter === a ? " active" : ""}`}
                      onClick={() => setAgentFilter((f) => (f === a ? "all" : a))}
                      title={`Filtrer par ${a}`}
                    >
                      <motion.div
                        className="proxima-dash-chart-bar"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${[72, 58, 85, 64][i] * (metricPeriod === "7j" ? 0.85 : metricPeriod === "90j" ? 1.1 : 1)}%`,
                        }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        key={`${a}-${metricPeriod}`}
                      />
                      <span>{a}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="proxima-dash-agents">
        <button
          type="button"
          className={`proxima-dash-agent${agentFilter === "all" ? " active" : ""}`}
          onClick={() => setAgentFilter("all")}
        >
          Tous
        </button>
        {AGENTS.map((a) => (
          <button
            key={a}
            type="button"
            className={`proxima-dash-agent${agentFilter === a ? " active" : ""}`}
            onClick={() => setAgentFilter((f) => (f === a ? "all" : a))}
          >
            {a}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
