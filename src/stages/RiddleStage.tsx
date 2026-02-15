import { useState } from "react";
import type { Stage } from "../types";

interface Props {
  stage: Stage;
  onSubmit: (answer: string) => Promise<boolean>;
}

export default function RiddleStage({ stage, onSubmit }: Props) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    const ok = await onSubmit(answer.trim().toUpperCase());
    setLoading(false);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>{stage.description}</p>
      <div style={{ background: "rgba(139,26,26,0.06)", border: "2px solid rgba(139,26,26,0.15)", borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem", position: "relative" }}>
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--parchment)", padding: "0 0.8rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 2, color: "var(--blood-red)" }}>Énigme</span>
        </div>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--ink)", fontStyle: "italic" }}>{stage.riddle}</p>
      </div>
      <div style={{ maxWidth: 360, margin: "0 auto", animation: error ? "shake 0.4s ease" : "none" }}>
        <input className="input-ninja" type="text" placeholder="Ta réponse..."
          value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ marginBottom: "1rem", letterSpacing: 3 }} disabled={loading} />
        <button className="btn-ninja" onClick={handleSubmit} style={{ width: "100%" }} disabled={loading}>
          {loading ? "Vérification..." : "Répondre"}
        </button>
      </div>
      {error && <p style={{ color: "#e53935", marginTop: "0.8rem", fontSize: "0.9rem" }}>❌ Ce n'est pas la bonne réponse.</p>}
    </div>
  );
}
