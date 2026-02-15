import type { LeaderboardEntry } from "../types";
import { formatTime } from "../utils/helpers";

const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  entries: LeaderboardEntry[];
  playerName: string;
  onBack: () => void;
}

export default function LeaderboardPage({ entries, playerName, onBack }: Props) {
  const sorted = [...entries].sort((a, b) => Number(a.elapsed_ms) - Number(b.elapsed_ms));

  return (
    <div style={{ minHeight: "100vh", padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: "1.5rem" }}>← Retour</button>

      <div className="parchment" style={{ animation: "fadeInScale 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.5rem", color: "var(--ink)", letterSpacing: 2 }}>
            🏆 Classement des Ninjas
          </h2>
          <div className="divider" />
        </div>

        {sorted.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.5, fontStyle: "italic" }}>
            Aucun ninja n'a encore terminé la chasse...
          </p>
        ) : (
          <div>
            {sorted.map((entry, i) => {
              const isMe = entry.name === playerName;
              return (
                <div
                  key={entry.name + i}
                  className="leaderboard-row"
                  style={{
                    animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                    background: isMe
                      ? "rgba(74,158,255,0.08)"
                      : i === 0 ? "rgba(255,215,0,0.1)"
                      : i === 1 ? "rgba(192,192,192,0.06)"
                      : i === 2 ? "rgba(205,127,50,0.06)"
                      : undefined,
                    border: isMe ? "1px solid rgba(74,158,255,0.2)" : "none",
                  }}
                >
                  <div style={{ width: 36, textAlign: "center", fontWeight: "bold", fontSize: i < 3 ? "1.2rem" : "0.9rem", color: "var(--ink-light)", flexShrink: 0 }}>
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </div>
                  <div style={{ flex: 1, marginLeft: "0.5rem" }}>
                    <p style={{ fontWeight: isMe ? "bold" : "normal", color: "var(--ink)", fontSize: "0.95rem" }}>
                      {entry.name}
                      {isMe && <span style={{ fontSize: "0.7rem", marginLeft: 6, opacity: 0.5 }}>(toi)</span>}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "0.95rem", fontWeight: "bold", color: "var(--blood-red)" }}>
                      {entry.score.toLocaleString()} pts
                    </p>
                    <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>{formatTime(Number(entry.elapsed_ms))}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}