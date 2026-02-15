import { STAGES } from "../config";
import { formatTime } from "../utils/helpers";

interface Props {
  playerName: string;
  completedStages: number[];
  elapsedMs: number;
  onSelectStage: (id: number) => void;
  onShowLeaderboard: () => void;
}

export default function HubPage({ playerName, completedStages, elapsedMs, onSelectStage, onShowLeaderboard }: Props) {
  const currentStage =
    completedStages.length >= STAGES.length
      ? null
      : STAGES.find((s) => !completedStages.includes(s.id))?.id ?? null;

  return (
    <div style={{ minHeight: "100vh", padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}>
      <div className="kanji-bg" style={{ top: "10%", right: "-8%", fontSize: "12rem" }}>道</div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          animation: "slideDown 0.5s ease",
        }}
      >
        <div>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", color: "var(--parchment-light)", fontSize: "1.3rem", letterSpacing: 2 }}>
            {playerName}
          </h2>
          <p style={{ color: "var(--parchment)", opacity: 0.5, fontSize: "0.85rem" }}>
            {completedStages.length} / {STAGES.length} épreuves complétées
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginBottom: 4 }}>⏱ {formatTime(elapsedMs)}</p>
          <button className="btn-ghost" onClick={onShowLeaderboard} style={{ fontSize: "0.8rem" }}>
            🏆 Classement
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: "rgba(212,165,116,0.1)", borderRadius: 3, marginBottom: "2rem", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${(completedStages.length / STAGES.length) * 100}%`,
            background: "linear-gradient(90deg, var(--blood-red), var(--gold))",
            borderRadius: 3,
            transition: "width 0.8s ease",
          }}
        />
      </div>

      {/* Stage list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {STAGES.map((stage, i) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={stage.id}
              className={`stage-card ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
              onClick={() => !isLocked && onSelectStage(stage.id)}
              style={{ animation: `fadeIn 0.5s ease ${i * 0.08}s both` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: isCompleted
                      ? "linear-gradient(135deg, #2e7d32, #4caf50)"
                      : isCurrent
                        ? "linear-gradient(135deg, var(--blood-red), #a02020)"
                        : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                    border: isCurrent ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {isCompleted ? "✓" : isLocked ? "🔒" : stage.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      color: isLocked ? "rgba(212,165,116,0.4)" : "var(--parchment-light)",
                      fontSize: "1.05rem",
                      marginBottom: 2,
                      fontFamily: "'MedievalSharp', serif",
                    }}
                  >
                    Étape {stage.id} — {stage.title}
                  </h3>
                  <p style={{ color: "var(--parchment)", opacity: isLocked ? 0.3 : 0.5, fontSize: "0.85rem" }}>
                    {stage.subtitle}
                  </p>
                </div>
                {!isLocked && !isCompleted && (
                  <span style={{ color: "var(--gold)", fontSize: "1.2rem" }}>→</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
