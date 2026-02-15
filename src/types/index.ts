export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "code" | "cipher" | "memory" | "puzzle" | "riddle" | "final";
  icon: string;
  // Cipher-specific
  cipherText?: string;
  // Memory-specific
  sequence?: number[];
  // Riddle-specific
  riddle?: string;
}

export interface LeaderboardEntry {
  name: string;
  elapsed_ms: number;
  score: number;
  completed_at?: string;
}

export interface MudraSign {
  name: string;
  symbol: string;
  kanji: string;
}

export type Screen = "landing" | "hub" | "stage" | "complete" | "leaderboard";
