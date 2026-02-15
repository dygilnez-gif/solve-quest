import { useState, useEffect } from "react";
import type { Stage } from "../types";
import { STAGES } from "../config";
import { supabase } from "../lib/supabase";

interface Props {
  stage: Stage;
  completedStages: number[];
  playerId: string;
  onSubmit: (answer: string) => Promise<boolean>;
}

export default function FinalStage({ stage, completedStages, playerId, onSubmit }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstLetters, setFirstLetters] = useState<Record<number, string>>({});

  // Récupère les premières lettres des réponses validées (côté serveur)
  useEffect(() => {
    async function fetchLetters() {
      try {
        const { data } = await supabase.rpc("get_first_letters", { p_player_id: playerId });
        if (data) {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          const map: Record<number, string> = {};
          (parsed as Array<{ stage_id: number; letter: string }>).forEach((r) => {
            map[r.stage_id] = r.letter;
          });
          setFirstLetters(map);
        }
      } catch {}
    }
    fetchLetters();
  }, [playerId]);

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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", maxWidth: 360, margin: "0 auto 1.5rem" }}>
        {STAGES.slice(0, -1).map((s, i) => (
          <div key={s.id} style={{ background: "rgba(26,15,10,0.06)", border: "1px solid rgba(139,26,26,0.15)", borderRadius: 6, padding: "0.6rem", animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}>
            <p style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: 2 }}>Étape {s.id}</p>
            <p style={{ fontSize: "1.3rem", color: "var(--blood-red)", fontWeight: "bold", fontFamily: "'Noto Serif JP', serif" }}>
              {completedStages.includes(s.id) ? (firstLetters[s.id] ?? "✓") : "?"}
            </p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 360, margin: "0 auto", animation: error ? "shake 0.4s ease" : "none" }}>
        <input className="input-ninja" type="text" placeholder="Le code final..."
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ marginBottom: "1rem", letterSpacing: 6, fontSize: "1.4rem" }} disabled={loading} />
        <button className="btn-ninja" onClick={handleSubmit} style={{ width: "100%" }} disabled={loading}>
          {loading ? "Vérification..." : "⛩️ Ouvrir le Sceau Final"}
        </button>
      </div>
      {error && <p style={{ color: "#e53935", marginTop: "0.8rem", fontSize: "0.9rem" }}>❌ Le sceau reste fermé...</p>}
    </div>
  );
}
