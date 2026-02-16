import { useState } from "react";
import type { Stage } from "../types";
import { MUDRA_SIGNS } from "../config";
import { supabase } from "../lib/supabase";

interface Props {
  stage: Stage;
  playerId: string;
  onSubmit: (answer: string) => Promise<boolean>;
}

type Phase = "locked" | "ready" | "showing" | "input" | "fail";

export default function MemoryStage({ stage, playerId, onSubmit }: Props) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [showIndex, setShowIndex] = useState(-1);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);

  const seq = stage.sequence!;

  const handleAccessCode = async () => {
    if (!accessCode.trim() || codeLoading) return;
    setCodeLoading(true);
    try {
      const { data, error } = await supabase.rpc("check_access_code", {
        p_player_id: playerId,
        p_stage_id: stage.id,
        p_code: accessCode.trim().toUpperCase(),
      });
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (!error && parsed?.valid) {
        setPhase("ready");
      } else {
        setCodeError(true);
        setTimeout(() => setCodeError(false), 600);
      }
    } catch {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 600);
    }
    setCodeLoading(false);
  };

  const startShow = () => {
    setPhase("showing");
    setShowIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowIndex(-1);
          setPhase("input");
          setPlayerSequence([]);
        }, 800);
      } else {
        setShowIndex(i);
      }
    }, 900);
  };

  const handlePick = async (idx: number) => {
    if (phase !== "input") return;
    const next = [...playerSequence, idx];
    setPlayerSequence(next);

    const pos = next.length - 1;
    if (next[pos] !== seq[pos]) {
      setPhase("fail");
      return;
    }

    if (next.length === seq.length) {
      const ok = await onSubmit(next.join(","));
      if (!ok) setPhase("fail");
    }
  };

  // ── Phase : Verrou ──
  if (phase === "locked") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>
          {stage.description}
        </p>

        <div style={{
          background: "rgba(139,26,26,0.06)", border: "2px solid rgba(139,26,26,0.15)",
          borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem",
          maxWidth: 380, margin: "0 auto",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🔒</div>
          <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1.2rem", lineHeight: 1.6 }}>
            Ce sceau est verrouillé. Entre le code d'accès pour débloquer l'épreuve.
          </p>

          <div style={{ animation: codeError ? "shake 0.4s ease" : "none" }}>
            <input
              className="input-ninja"
              type="text"
              placeholder="Code d'accès..."
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleAccessCode()}
              style={{
                marginBottom: "1rem",
                fontSize: "1.2rem",
                letterSpacing: 4,
                borderColor: codeError ? "#e53935" : undefined,
              }}
              disabled={codeLoading}
            />
          </div>

          <button
            className="btn-ninja"
            onClick={handleAccessCode}
            style={{ width: "100%" }}
            disabled={codeLoading}
          >
            {codeLoading ? "Vérification..." : "Briser le Verrou"}
          </button>

          {codeError && (
            <p style={{ color: "#e53935", marginTop: "0.8rem", fontSize: "0.9rem" }}>
              ❌ Code incorrect. Le sceau résiste.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Phase : Jeu de mémoire ──
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.7, color: "var(--ink-light)" }}>
        Le verrou est brisé ! Reproduis maintenant la séquence exacte de mudras pour briser le sceau définitivement.
      </p>

      {phase === "ready" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <p style={{ marginBottom: "1rem", opacity: 0.7 }}>Prêt à mémoriser la séquence de {seq.length} mudras ?</p>
          <button className="btn-ninja" onClick={startShow}>🤲 Montrer la Séquence</button>
        </div>
      )}

      {phase === "showing" && (
        <div style={{ animation: "fadeInScale 0.3s ease" }}>
          <p style={{ marginBottom: "1rem", color: "var(--blood-red)", fontWeight: "bold" }}>
            Mémorise ! ({showIndex + 1}/{seq.length})
          </p>
          <div style={{ width: 120, height: 120, margin: "0 auto", background: "linear-gradient(135deg, rgba(139,26,26,0.15), rgba(201,168,76,0.1))", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "3px solid var(--gold)", animation: "pulse 0.8s ease infinite" }}>
            <span style={{ fontSize: "2.5rem" }}>{showIndex >= 0 ? MUDRA_SIGNS[seq[showIndex]].symbol : ""}</span>
            <span style={{ fontSize: "0.8rem", marginTop: 4, color: "var(--ink-light)" }}>{showIndex >= 0 ? MUDRA_SIGNS[seq[showIndex]].name : ""}</span>
          </div>
        </div>
      )}

      {(phase === "input" || phase === "fail") && (
        <div>
          <p style={{ marginBottom: "0.5rem", opacity: 0.7, fontSize: "0.9rem" }}>
            Reproduis la séquence ({playerSequence.length}/{seq.length})
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: "1.2rem", minHeight: 24 }}>
            {seq.map((_, i) => (
              <div key={i} style={{ width: 32, height: 6, borderRadius: 3, background: i < playerSequence.length ? (phase === "fail" && i === playerSequence.length - 1 ? "#e53935" : "#4caf50") : "rgba(26,15,10,0.15)", transition: "background 0.2s" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.7rem", maxWidth: 320, margin: "0 auto" }}>
            {MUDRA_SIGNS.map((sign, i) => (
              <button key={i} onClick={() => handlePick(i)} disabled={phase === "fail"}
                style={{ background: "rgba(26,15,10,0.06)", border: "2px solid rgba(139,26,26,0.2)", borderRadius: 8, padding: "0.8rem 0.4rem", cursor: phase === "fail" ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'MedievalSharp', serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: "1.6rem" }}>{sign.symbol}</span>
                <span style={{ fontSize: "1rem", color: "var(--blood-red)", fontFamily: "'Noto Serif JP', serif" }}>{sign.kanji}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--ink-light)", opacity: 0.7 }}>{sign.name}</span>
              </button>
            ))}
          </div>
          {phase === "fail" && (
            <div style={{ marginTop: "1.2rem", animation: "fadeIn 0.3s ease" }}>
              <p style={{ color: "#e53935", marginBottom: "0.8rem" }}>❌ Mauvaise séquence !</p>
              <button className="btn-ninja" onClick={() => { setPhase("ready"); setPlayerSequence([]); }}>Réessayer</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}