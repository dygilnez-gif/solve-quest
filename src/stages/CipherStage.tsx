import { useState } from "react";
import type { Stage } from "../types";

interface Props {
  stage: Stage;
  onSubmit: (answer: string) => Promise<boolean>;
}

export default function CipherStage({ stage, onSubmit }: Props) {
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
    <div>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>{stage.description}</p>

      <div style={{ background: "rgba(26,15,10,0.08)", borderRadius: 6, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(139,26,26,0.15)" }}>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "0.5rem", textAlign: "center", textTransform: "uppercase", letterSpacing: 2 }}>Message intercepté</p>
        <p style={{ fontFamily: "monospace", fontSize: "1.5rem", letterSpacing: 6, textAlign: "center", color: "var(--blood-red)", fontWeight: "bold" }}>
          {stage.cipherText}
        </p>
      </div>

      <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "center", animation: error ? "shake 0.4s ease" : "none" }}>
        <input className="input-ninja" type="text" placeholder="Le mot déchiffré..."
          value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ marginBottom: "1rem", letterSpacing: 3 }} disabled={loading} />
        <button className="btn-ninja" onClick={handleSubmit} style={{ width: "100%" }} disabled={loading}>
          {loading ? "Vérification..." : "Confirmer"}
        </button>
      </div>
      {error && <p style={{ color: "#e53935", marginTop: "0.8rem", fontSize: "0.9rem", textAlign: "center" }}>❌ Ce n'est pas le bon mot.</p>}
    </div>
  );
}
