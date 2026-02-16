import { useState, useCallback } from "react";
import type { Stage } from "../types";
import { STAGES } from "../config";
import { checkAnswer } from "../utils/api";
import CodeStage from "../stages/CodeStage";
import CipherStage from "../stages/CipherStage";
import MemoryStage from "../stages/MemoryStage";
import PuzzleStage from "../stages/PuzzleStage";
import RiddleStage from "../stages/RiddleStage";
import FinalStage from "../stages/FinalStage";

interface Props {
  stage: Stage;
  completedStages: number[];
  playerId: string;
  onComplete: (stageId: number) => void;
  onBack: () => void;
}

export default function StagePage({ stage, completedStages, playerId, onComplete, onBack }: Props) {
  const [success, setSuccess] = useState(false);

  // Envoie la réponse au serveur, retourne true si correct
  const handleSubmit = useCallback(async (answer: string): Promise<boolean> => {
    try {
      const result = await checkAnswer(playerId, stage.id, answer);
      if (result.correct) {
        setSuccess(true);
        setTimeout(() => onComplete(stage.id), 1500);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur vérification:", err);
      return false;
    }
  }, [playerId, stage.id, onComplete]);

  const renderStage = () => {
    if (success) {
      return (
        <div style={{ textAlign: "center", animation: "fadeInScale 0.5s ease", padding: "2rem 0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "successPulse 0.6s ease" }}>✅</div>
          <h3 style={{ fontFamily: "'Cinzel Decorative', serif", color: "var(--ink)", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
            Épreuve Réussie !
          </h3>
          <p style={{ opacity: 0.6 }}>Passage à la suite...</p>
        </div>
      );
    }

    switch (stage.type) {
      case "code": return <CodeStage stage={stage} onSubmit={handleSubmit} />;
      case "cipher": return <CipherStage stage={stage} onSubmit={handleSubmit} />;
      case "memory": return <MemoryStage stage={stage} playerId={playerId} onSubmit={handleSubmit} />;
      case "puzzle": return <PuzzleStage stage={stage} onSubmit={handleSubmit} />;
      case "riddle": return <RiddleStage stage={stage} onSubmit={handleSubmit} />;
      case "final": return <FinalStage stage={stage} completedStages={completedStages} playerId={playerId} onSubmit={handleSubmit} />;
      default: return <CodeStage stage={stage} onSubmit={handleSubmit} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: "1.5rem", animation: "fadeIn 0.3s ease" }}>
        ← Retour au Hub
      </button>
      <div className="parchment" style={{ animation: "fadeInScale 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>{stage.icon}</span>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 3, opacity: 0.5, marginBottom: "0.3rem" }}>
            Étape {stage.id} sur {STAGES.length}
          </p>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.4rem", color: "var(--ink)", letterSpacing: 1 }}>
            {stage.title}
          </h2>
          <div className="divider" />
        </div>
        {renderStage()}
      </div>
    </div>
  );
}