-- ╔══════════════════════════════════════════════════════════════╗
-- ║  NARUTO TREASURE HUNT — Supabase Migration                 ║
-- ║  Lance ce script dans le SQL Editor de Supabase             ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════════════════════════════
-- 1. TABLES
-- ═══════════════════════════════════════════════════════════════

-- Configuration globale du jeu (une seule ligne)
CREATE TABLE IF NOT EXISTS game_config (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  game_open_time timestamptz NOT NULL DEFAULT '2025-03-01T12:00:00Z',
  max_points int NOT NULL DEFAULT 10000,
  point_decay_per_minute numeric NOT NULL DEFAULT 2
);

-- Les réponses des étapes — JAMAIS exposées au client
CREATE TABLE IF NOT EXISTS stages (
  id int PRIMARY KEY,
  answer text NOT NULL
);

-- Joueurs inscrits
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Progression : quelles étapes chaque joueur a terminé
CREATE TABLE IF NOT EXISTS player_progress (
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  stage_id int REFERENCES stages(id),
  completed_at timestamptz DEFAULT now(),
  PRIMARY KEY (player_id, stage_id)
);

-- Classement final
CREATE TABLE IF NOT EXISTS leaderboard (
  player_id uuid REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  player_name text NOT NULL,
  elapsed_ms bigint NOT NULL,
  score int NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- 2. RPC FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Inscription / connexion d'un joueur (retourne id + progression)
CREATE OR REPLACE FUNCTION register_player(p_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_player_id uuid;
  v_progress int[];
  v_is_complete boolean;
BEGIN
  -- Cherche un joueur existant ou en crée un nouveau
  SELECT id INTO v_player_id FROM players WHERE UPPER(name) = UPPER(TRIM(p_name));

  IF v_player_id IS NULL THEN
    INSERT INTO players (name) VALUES (UPPER(TRIM(p_name))) RETURNING id INTO v_player_id;
  END IF;

  -- Récupère la progression
  SELECT ARRAY_AGG(stage_id ORDER BY stage_id)
  INTO v_progress
  FROM player_progress
  WHERE player_id = v_player_id;

  -- Vérifie si le joueur a déjà terminé
  SELECT EXISTS(SELECT 1 FROM leaderboard WHERE player_id = v_player_id) INTO v_is_complete;

  RETURN json_build_object(
    'player_id', v_player_id,
    'name', UPPER(TRIM(p_name)),
    'completed_stages', COALESCE(v_progress, ARRAY[]::int[]),
    'is_complete', v_is_complete
  );
END;
$$;

-- Vérification d'une réponse (universelle, toutes étapes)
CREATE OR REPLACE FUNCTION check_answer(p_player_id uuid, p_stage_id int, p_answer text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_correct text;
  v_already boolean;
  v_prev_completed boolean;
  v_expected_stage int;
BEGIN
  -- Vérifie que le joueur existe
  IF NOT EXISTS(SELECT 1 FROM players WHERE id = p_player_id) THEN
    RETURN json_build_object('correct', false, 'error', 'Joueur inconnu');
  END IF;

  -- Déjà complétée ?
  SELECT EXISTS(
    SELECT 1 FROM player_progress WHERE player_id = p_player_id AND stage_id = p_stage_id
  ) INTO v_already;

  IF v_already THEN
    RETURN json_build_object('correct', true, 'already_completed', true);
  END IF;

  -- Vérifie que le joueur a complété les étapes précédentes (anti-skip)
  SELECT COALESCE(MAX(stage_id), 0) + 1
  INTO v_expected_stage
  FROM player_progress
  WHERE player_id = p_player_id;

  IF p_stage_id > v_expected_stage THEN
    RETURN json_build_object('correct', false, 'error', 'Étape précédente non complétée');
  END IF;

  -- Récupère la bonne réponse
  SELECT answer INTO v_correct FROM stages WHERE id = p_stage_id;

  IF v_correct IS NULL THEN
    RETURN json_build_object('correct', false, 'error', 'Étape inconnue');
  END IF;

  -- Compare (insensible à la casse + trim)
  IF UPPER(TRIM(p_answer)) = UPPER(TRIM(v_correct)) THEN
    INSERT INTO player_progress (player_id, stage_id)
    VALUES (p_player_id, p_stage_id)
    ON CONFLICT DO NOTHING;

    RETURN json_build_object('correct', true, 'already_completed', false);
  END IF;

  RETURN json_build_object('correct', false);
END;
$$;

-- Soumettre la complétion finale (calcul du score côté serveur)
CREATE OR REPLACE FUNCTION submit_completion(p_player_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total int;
  v_done int;
  v_open_time timestamptz;
  v_max_pts int;
  v_decay numeric;
  v_elapsed_ms bigint;
  v_score int;
  v_name text;
BEGIN
  -- Compte les étapes
  SELECT count(*) INTO v_total FROM stages;
  SELECT count(*) INTO v_done FROM player_progress WHERE player_id = p_player_id;

  IF v_done < v_total THEN
    RETURN json_build_object('success', false, 'error', 'Toutes les étapes ne sont pas complétées');
  END IF;

  -- Config du jeu
  SELECT game_open_time, max_points, point_decay_per_minute
  INTO v_open_time, v_max_pts, v_decay
  FROM game_config WHERE id = 1;

  -- Calcul du temps et du score
  v_elapsed_ms := EXTRACT(EPOCH FROM (now() - v_open_time))::bigint * 1000;
  v_score := GREATEST(100, ROUND(v_max_pts - (v_elapsed_ms / 60000.0) * v_decay)::int);

  -- Nom du joueur
  SELECT name INTO v_name FROM players WHERE id = p_player_id;

  -- Insert ou update le leaderboard (garde le meilleur score)
  INSERT INTO leaderboard (player_id, player_name, elapsed_ms, score)
  VALUES (p_player_id, v_name, v_elapsed_ms, v_score)
  ON CONFLICT (player_id) DO UPDATE SET
    elapsed_ms = LEAST(leaderboard.elapsed_ms, EXCLUDED.elapsed_ms),
    score = GREATEST(leaderboard.score, EXCLUDED.score),
    completed_at = now();

  RETURN json_build_object(
    'success', true,
    'score', v_score,
    'elapsed_ms', v_elapsed_ms
  );
END;
$$;

-- Récupérer le leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT player_name as name, elapsed_ms, score, completed_at
      FROM leaderboard
      ORDER BY score DESC, elapsed_ms ASC
    ) t
  );
END;
$$;

-- Récupérer le game config (heure d'ouverture)
CREATE OR REPLACE FUNCTION get_game_config()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT row_to_json(t)
    FROM (
      SELECT game_open_time, max_points, point_decay_per_minute
      FROM game_config WHERE id = 1
    ) t
  );
END;
$$;

-- Récupérer les premières lettres des réponses validées (pour l'étape finale)
CREATE OR REPLACE FUNCTION get_first_letters(p_player_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT pp.stage_id, LEFT(s.answer, 1) as letter
      FROM player_progress pp
      JOIN stages s ON s.id = pp.stage_id
      WHERE pp.player_id = p_player_id
      AND pp.stage_id < (SELECT MAX(id) FROM stages) -- Exclut la dernière étape
      ORDER BY pp.stage_id
    ) t
  );
END;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 3. ADMIN FUNCTIONS (protégées par code dans le client)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION admin_set_game_time(p_new_time timestamptz)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE game_config SET game_open_time = p_new_time WHERE id = 1;
  RETURN json_build_object('success', true, 'new_time', p_new_time);
END;
$$;

CREATE OR REPLACE FUNCTION admin_reset_leaderboard()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM leaderboard;
  DELETE FROM player_progress;
  RETURN json_build_object('success', true);
END;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Bloque tout accès direct aux tables (on passe par les RPC)
-- Les RPC fonctions sont en SECURITY DEFINER donc elles bypassent la RLS

-- On autorise la lecture du leaderboard en direct pour le temps réel (optionnel)
CREATE POLICY "Leaderboard lisible par tous" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Config lisible par tous" ON game_config FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- 5. SEED DATA — Modifie les réponses ici !
-- ═══════════════════════════════════════════════════════════════

-- Config initiale
INSERT INTO game_config (id, game_open_time, max_points, point_decay_per_minute)
VALUES (1, '2025-03-01T12:00:00Z', 10000, 2)
ON CONFLICT (id) DO UPDATE SET
  game_open_time = EXCLUDED.game_open_time;

-- Réponses des étapes (MODIFIE ICI)
INSERT INTO stages (id, answer) VALUES
  (1, 'KAGEBUNSHIN'),       -- Étape 1 : Le Message Intercepté
  (2, 'SHURIKEN'),          -- Étape 2 : Le Chiffre de l'Ombre
  (3, '0,3,1,4,2,5'),       -- Étape 3 : Les Mudras (séquence comme string)
  (4, 'SHARINGAN'),         -- Étape 4 : L'URL Fantôme
  (5, 'COMPLETED'),         -- Étape 5 : Le Puzzle (envoyé auto quand résolu)
  (6, 'HASHIRAMA'),         -- Étape 6 : L'Énigme du Sage
  (7, 'KSSSHK')             -- Étape 7 : Le Sceau Final
ON CONFLICT (id) DO UPDATE SET answer = EXCLUDED.answer;
