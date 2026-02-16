import { useState } from "react";
import type { Stage } from "../types";

const PIECES = [
  { id: 0, symbol: "影", bg: "#4a2a6b" },
  { id: 1, symbol: "忍", bg: "#1a3a6b" },
  { id: 2, symbol: "力", bg: "#8b1a1a" },
  { id: 3, symbol: "木", bg: "#2d5a27" },
  { id: 4, symbol: "葉", bg: "#1a5a3a" },
  { id: 5, symbol: "志", bg: "#a04420" },
  { id: 6, symbol: "道", bg: "#6b4c2a" },
  { id: 7, symbol: "光", bg: "#7a3a1a" },
  { id: 8, symbol: "火", bg: "#5a1a3a" },
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

      {/* Texte RP avec les mots-clés en gras */}
      <div style={{
        background: "rgba(139,26,26,0.06)", border: "2px solid rgba(139,26,26,0.15)",
        borderRadius: 8, padding: "1.2rem 1.5rem", marginBottom: "1.5rem",
        position: "relative", textAlign: "left",
      }}>
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--parchment)", padding: "0 0.8rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 2, color: "var(--blood-red)" }}>Inscription sur le sceau</span>
        </div>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: "var(--ink)", fontStyle: "italic" }}>
          « Dans l'<b style={{ color: "var(--blood-red)" }}>ombre</b> de la nuit,
          un <b style={{ color: "var(--blood-red)" }}>ninja</b> puise
          sa <b style={{ color: "var(--blood-red)" }}>force</b> au
          pied du grand <b style={{ color: "var(--blood-red)" }}>arbre</b> dont
          chaque <b style={{ color: "var(--blood-red)" }}>feuille</b> porte
          la <b style={{ color: "var(--blood-red)" }}>volonté</b> de
          ceux qui ont tracé le <b style={{ color: "var(--blood-red)" }}>chemin</b>.
          Seule la <b style={{ color: "var(--blood-red)" }}>lumière</b> du <b style={{ color: "var(--blood-red)" }}>feu</b> sacré
          pourra guider tes pas. »
        </p>
      </div>

      <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "0.5rem" }}>
        Clique sur deux pièces pour les échanger
      </p>
      <p style={{ fontSize: "0.8rem", opacity: 0.4, marginBottom: "1rem" }}>
        Échanges : {moves}
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6,
        maxWidth: 280, margin: "0 auto",
        background: "rgba(26,15,10,0.1)", padding: 8, borderRadius: 10,
        border: "2px solid rgba(139,26,26,0.2)",
      }}>
        {grid.map((piece, idx) => {
          const isSelected = selected === idx;
          const isCorrect = piece.id === idx;
          return (
            <button key={idx} onClick={() => handleClick(idx)}
              style={{
                width: "100%", aspectRatio: "1",
                background: `linear-gradient(135deg, ${piece.bg}, ${piece.bg}cc)`,
                border: isSelected ? "3px solid var(--gold-bright)"
                  : isCorrect ? "2px solid rgba(76,175,80,0.4)"
                  : "2px solid rgba(201,168,76,0.25)",
                borderRadius: 8,
                cursor: submitting ? "default" : "pointer",
                fontFamily: "'Noto Serif JP', serif", fontSize: "1.8rem",
                color: "var(--parchment-light)",
                transition: "all 0.2s ease",
                transform: isSelected ? "scale(1.08)" : "scale(1)",
                boxShadow: isSelected ? "0 0 15px rgba(255,215,0,0.5)" : "0 2px 6px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              {piece.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}