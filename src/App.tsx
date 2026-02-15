import { useState, useEffect, useCallback } from "react";
import type { Screen, LeaderboardEntry } from "./types";
import { STAGES } from "./config";
import {
  registerPlayer,
  submitCompletion,
  getLeaderboard,
  getGameConfig,
} from "./utils/api";

import Embers from "./components/Embers";
import LandingPage from "./components/LandingPage";
import HubPage from "./components/HubPage";
import StagePage from "./components/StagePage";
import CompletionPage from "./components/CompletionPage";
import LeaderboardPage from "./components/LeaderboardPage";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameOpenTime, setGameOpenTime] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completionScore, setCompletionScore] = useState(0);
  const [completionElapsed, setCompletionElapsed] = useState(0);

  const elapsedMs = now - gameOpenTime;

  // ── Timer ──
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Init : charger config + session sauvegardée ──
  useEffect(() => {
    async function init() {
      try {
        // Charger la config du jeu
        const config = await getGameConfig();
        setGameOpenTime(new Date(config.game_open_time).getTime());

        // Charger le leaderboard
        const lb = await getLeaderboard();
        setLeaderboard(lb);

        // Reprendre la session si elle existe
        const savedId = localStorage.getItem("hunt-player-id");
        const savedName = localStorage.getItem("hunt-player-name");
        if (savedId && savedName) {
          const result = await registerPlayer(savedName);
          setPlayerId(result.player_id);
          setPlayerName(result.name);
          setCompletedStages(result.completed_stages);
          setIsComplete(result.is_complete);

          // Si déjà terminé, charger score/temps depuis le leaderboard
          if (result.is_complete) {
            const myEntry = lb.find((e) => e.name === result.name);
            if (myEntry) {
              setCompletionScore(Number(myEntry.score) || 0);
              setCompletionElapsed(Number(myEntry.elapsed_ms) || 0);
            }
          }

          setScreen("hub");
        }
      } catch (err) {
        console.error("Erreur init:", err);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  // ── Inscription ──
  const handleStart = useCallback(async (name: string) => {
    try {
      const result = await registerPlayer(name);
      setPlayerId(result.player_id);
      setPlayerName(result.name);
      setCompletedStages(result.completed_stages);
      setIsComplete(result.is_complete);

      // Sauvegarder en local pour reprendre la session
      localStorage.setItem("hunt-player-id", result.player_id);
      localStorage.setItem("hunt-player-name", result.name);

      setScreen("hub");
    } catch (err) {
      console.error("Erreur inscription:", err);
      alert("Erreur lors de l'inscription. Réessaie !");
    }
  }, []);

  // ── Complétion d'une étape ──
  const handleStageComplete = useCallback(
    async (stageId: number) => {
      const newCompleted = [...completedStages, stageId];
      setCompletedStages(newCompleted);

      if (newCompleted.length >= STAGES.length) {
        // Toutes les étapes complétées → soumettre au serveur
        try {
          const result = await submitCompletion(playerId);
          console.log("[handleStageComplete] result:", result);
          if (result.success) {
            const score = Number(result.score) || 0;
            const elapsed = Number(result.elapsed_ms) || 0;
            console.log("[handleStageComplete] score:", score, "elapsed:", elapsed);
            setCompletionScore(score);
            setCompletionElapsed(elapsed);
            setIsComplete(true);

            // Refresh leaderboard
            const lb = await getLeaderboard();
            setLeaderboard(lb);

            setScreen("complete");
          }
        } catch (err) {
          console.error("Erreur soumission:", err);
        }
      } else {
        setScreen("hub");
      }
    },
    [completedStages, playerId]
  );

  // ── Refresh leaderboard ──
  const refreshLeaderboard = useCallback(async () => {
    try {
      const lb = await getLeaderboard();
      setLeaderboard(lb);
    } catch {}
  }, []);

  // ── Loading screen ──
  if (isLoading) {
    return (
      <div className="scroll-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="seal-stamp" style={{ margin: "0 auto 1rem" }}>火</div>
          <p style={{ color: "var(--parchment)", opacity: 0.5, animation: "pulse 1.5s ease infinite" }}>
            Connexion au village...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="scroll-container">
      <Embers />

      {screen === "landing" && <LandingPage onStart={handleStart} />}

      {screen === "hub" && (
        <HubPage
          playerName={playerName}
          completedStages={completedStages}
          elapsedMs={elapsedMs}
          onSelectStage={(id) => { setSelectedStage(id); setScreen("stage"); }}
          onShowLeaderboard={() => { refreshLeaderboard(); setScreen("leaderboard"); }}
        />
      )}

      {screen === "stage" && selectedStage && (
        <StagePage
          stage={STAGES.find((s) => s.id === selectedStage)!}
          completedStages={completedStages}
          playerId={playerId}
          onComplete={handleStageComplete}
          onBack={() => setScreen("hub")}
        />
      )}

      {screen === "complete" && (
        <CompletionPage
          playerName={playerName}
          elapsedMs={completionElapsed}
          score={completionScore}
          onShowLeaderboard={() => { refreshLeaderboard(); setScreen("leaderboard"); }}
        />
      )}

      {screen === "leaderboard" && (
        <LeaderboardPage
          entries={leaderboard}
          playerName={playerName}
          onBack={() => setScreen(isComplete ? "complete" : "hub")}
        />
      )}

    </div>
  );
}