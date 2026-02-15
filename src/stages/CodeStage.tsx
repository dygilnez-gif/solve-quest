import { useState } from "react";
import type { Stage } from "../types";

interface Props {
  stage: Stage;
  onSubmit: (answer: string) => Promise<boolean>;
}

export default function CodeStage({ stage, onSubmit }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    const ok = await onSubmit(code.trim().toUpperCase());
    setLoading(false);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>{stage.description}</p>
      <div style={{ animation: error ? "shake 0.4s ease" : "none", maxWidth: 360, margin: "0 auto" }}>
        <input
          className="input-ninja" type="text" placeholder="Entre le code secret..."
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ marginBottom: "1rem", fontSize: "1.3rem", letterSpacing: 4, borderColor: error ? "#e53935" : undefined }}
          disabled={loading}
        />
        <button className="btn-ninja" onClick={handleSubmit} style={{ width: "100%" }} disabled={loading}>
          {loading ? "Vérification..." : "Vérifier"}
        </button>
      </div>
      {error && <p style={{ color: "#e53935", marginTop: "0.8rem", fontSize: "0.9rem" }}>❌ Code incorrect. Réessaie !</p>}
    </div>
  );
}
