import { formatTime } from "../utils/helpers";

interface Props {
  playerName: string;
  elapsedMs: number;
  score: number;
  onShowLeaderboard: () => void;
}

export default function CompletionPage({ playerName, elapsedMs, score, onShowLeaderboard }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="kanji-bg" style={{ top: "5%", left: "-3%", transform: "rotate(-10deg)" }}>勝</div>

      <div style={{ maxWidth: 520, width: "100%", textAlign: "center", animation: "fadeInScale 0.6s ease" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem", animation: "float 3s ease-in-out infinite" }}>⛩️</div>

        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "var(--gold-bright)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", letterSpacing: 3, marginBottom: "0.5rem" }}>
          MISSION ACCOMPLIE
        </h1>
        <p style={{ color: "var(--parchment)", opacity: 0.7, marginBottom: "2rem" }}>
          Le parchemin interdit a été retrouvé !
        </p>

        <div className="parchment" style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.1rem", marginBottom: "1rem", color: "var(--blood-red)" }}>
            {playerName}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 4 }}>TEMPS</p>
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "var(--ink)" }}>{formatTime(elapsedMs)}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 4 }}>SCORE</p>
              <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "var(--blood-red)" }}>{score.toLocaleString()} pts</p>
            </div>
          </div>

          <div className="divider" />
          <p style={{ fontStyle: "italic", opacity: 0.6, fontSize: "0.9rem", lineHeight: 1.6 }}>
            Tu as prouvé ta valeur, ninja. Ton nom restera gravé dans les archives de Konoha.
          </p>
        </div>

        <button className="btn-ninja" onClick={onShowLeaderboard} style={{ width: "100%" }}>
          🏆 Voir le Classement
        </button>
      </div>
    </div>
  );
}
