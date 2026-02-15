import { supabase } from "../lib/supabase";
import type { LeaderboardEntry } from "../types";

// ── Inscription / Connexion ─────────────────────────────────
export interface RegisterResult {
  player_id: string;
  name: string;
  completed_stages: number[];
  is_complete: boolean;
}

export async function registerPlayer(name: string): Promise<RegisterResult> {
  const { data, error } = await supabase.rpc("register_player", { p_name: name });
  if (error) throw new Error(error.message);
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return parsed as RegisterResult;
}

// ── Vérification de réponse ─────────────────────────────────
export interface CheckAnswerResult {
  correct: boolean;
  already_completed?: boolean;
  error?: string;
}

export async function checkAnswer(
  playerId: string,
  stageId: number,
  answer: string
): Promise<CheckAnswerResult> {
  const { data, error } = await supabase.rpc("check_answer", {
    p_player_id: playerId,
    p_stage_id: stageId,
    p_answer: answer,
  });
  if (error) throw new Error(error.message);
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return parsed as CheckAnswerResult;
}

// ── Soumission de complétion ────────────────────────────────
export interface CompletionResult {
  success: boolean;
  score?: number;
  elapsed_ms?: number;
  error?: string;
}

export async function submitCompletion(playerId: string): Promise<CompletionResult> {
  const { data, error } = await supabase.rpc("submit_completion", {
    p_player_id: playerId,
  });
  if (error) throw new Error(error.message);
  // Supabase peut renvoyer un string JSON ou un objet selon la version
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  console.log("[submitCompletion] raw:", data, "parsed:", parsed);
  return parsed as CompletionResult;
}

// ── Leaderboard ─────────────────────────────────────────────
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) throw new Error(error.message);
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return (parsed as LeaderboardEntry[]) ?? [];
}

// ── Game Config ─────────────────────────────────────────────
export interface GameConfig {
  game_open_time: string;
  max_points: number;
  point_decay_per_minute: number;
}

export async function getGameConfig(): Promise<GameConfig> {
  const { data, error } = await supabase.rpc("get_game_config");
  if (error) throw new Error(error.message);
  const parsed = typeof data === "string" ? JSON.parse(data) : data;
  return parsed as GameConfig;
}