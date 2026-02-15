import { useState } from "react";
import type { Stage } from "../types";

const PIECES = [
  { id: 0, symbol: "火", bg: "#8b1a1a" },
  { id: 1, symbol: "の", bg: "#a04420" },
  { id: 2, symbol: "意", bg: "#6b4c2a" },
  { id: 3, symbol: "志", bg: "#2d5a27" },
  { id: 4, symbol: "を", bg: "#1a5a3a" },
  { id: 5, symbol: "継", bg: "#1a3a6b" },
  { id: 6, symbol: "ぐ", bg: "#4a2a6b" },
  { id: 7, symbol: "者", bg: "#7a3a1a" },
  { id: 8, symbol: "!", bg: "#5a1a3a" },
];

function shuffle(arr: typeof PIECES): typeof PIECES {
  const a = [...arr];
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((v, i) => v.id === i));
  return a;
}

interface Props {
  stage: Stage;
  onSubmit: (answer: string) => Promise<boolean>;
}

export default function PuzzleStage({ stage, onSubmit }: Props) {
  const [grid, setGrid] = useState(() => shuffle(PIECES));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async (idx: number) => {
    if (submitting) return;
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const next = [...grid];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setGrid(next);
      setMoves(moves + 1);
      setSelected(null);
      if (next.every((p, i) => p.id === i)) {
        setSubmitting(true);
        await onSubmit("COMPLETED");
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>{stage.description}</p>
      <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "0.5rem" }}>Clique sur deux pièces pour les échanger</p>
      <p style={{ fontSize: "0.8rem", opacity: 0.4, marginBottom: "1rem" }}>Échanges : {moves}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, maxWidth: 280, margin: "0 auto", background: "rgba(26,15,10,0.1)", padding: 8, borderRadius: 10, border: "2px solid rgba(139,26,26,0.2)" }}>
        {grid.map((piece, idx) => {
          const isSelected = selected === idx;
          const isCorrect = piece.id === idx;
          return (
            <button key={idx} onClick={() => handleClick(idx)}
              style={{
                width: "100%", aspectRatio: "1",
                background: `linear-gradient(135deg, ${piece.bg}, ${piece.bg}cc)`,
                border: isSelected ? "3px solid var(--gold-bright)" : isCorrect ? "2px solid rgba(76,175,80,0.4)" : "2px solid rgba(201,168,76,0.25)",
                borderRadius: 8, cursor: submitting ? "default" : "pointer",
                fontFamily: "'Noto Serif JP', serif", fontSize: "1.8rem", color: "var(--parchment-light)",
                transition: "all 0.2s ease",
                transform: isSelected ? "scale(1.08)" : "scale(1)",
                boxShadow: isSelected ? "0 0 15px rgba(255,215,0,0.5)" : "0 2px 6px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
              {piece.symbol}
              <span style={{ position: "absolute", top: 3, right: 5, fontSize: "0.55rem", opacity: 0.4, color: "var(--parchment-light)" }}>{piece.id + 1}</span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "1.2rem", padding: "0.6rem 1rem", background: "rgba(26,15,10,0.06)", borderRadius: 6, border: "1px solid rgba(139,26,26,0.1)", display: "inline-block" }}>
        <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 4 }}>Ordre à reconstituer :</p>
        <p style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "1.1rem", letterSpacing: 3, color: "var(--blood-red)", fontWeight: "bold" }}>火 の 意 志 を 継 ぐ 者 !</p>
        <p style={{ fontSize: "0.7rem", opacity: 0.4, marginTop: 4, fontStyle: "italic" }}>« La Volonté du Feu »</p>
      </div>
    </div>
  );
}
