import type { Stage, MudraSign } from "./types";

// ═══════════════════════════════════════════════════════════════
// STAGES — Données d'affichage uniquement (aucune réponse !)
// ═══════════════════════════════════════════════════════════════
export const STAGES: Stage[] = [
  {
    id: 1,
    title: "Le Parchemin Oublié",
    subtitle: "Un message caché dans les ruines du village...",
    description:
      "Un ancien parchemin a été dissimulé quelque part dans Konoha par un agent de l'ANBU. Explore le village, retrouve-le et transcris le code qui y est inscrit.",
    type: "code",
    icon: "📜",
  },
  {
    id: 2,
    title: "Les Ombres de l'ANBU",
    subtitle: "Un message codé par les services secrets...",
    description:
      "Nos espions ont intercepté un message ennemi, mais il a été chiffré. Les lettres ont été décalées... À toi de percer le code et de révéler le mot caché.",
    type: "cipher",
    cipherText: "VKLUDLNHQ",
    icon: "🔐",
  },
  {
    id: 3,
    title: "Le Sceau des Anciens",
    subtitle: "Seule la bonne séquence brisera le sceau...",
    description:
      "Un puissant sceau protège le passage vers l'étape suivante. Pour le briser, tu dois reproduire la séquence exacte de mudras. Observe bien, puis reproduis-la sans te tromper.",
    type: "memory",
    sequence: [0, 3, 1, 4, 2, 5],
    icon: "🤲",
  },
  {
    id: 4,
    title: "Le Passage Secret",
    subtitle: "Un indice dissimulé dans les profondeurs du village...",
    description:
      "On murmure qu'un passage secret existe dans le quartier Uchiha. Explore le village en profondeur — tu y trouveras un parchemin menant à un lieu oublié. Rapporte le code qui y est inscrit.",
    type: "code",
    icon: "👁️",
  },
  {
    id: 5,
    title: "La Volonté Brisée",
    subtitle: "Reconstitue la phrase sacrée...",
    description:
      "Le sceau de la Volonté du Feu a été brisé ! Les fragments sont mélangés. Clique sur deux pièces pour les échanger et reconstitue la phrase sacrée.",
    type: "puzzle",
    icon: "🧩",
  },
  {
    id: 6,
    title: "L'Épreuve du Sage",
    subtitle: "Seuls les plus sages trouveront la réponse...",
    description:
      "Le Sage des Six Chemins te soumet une dernière énigme avant de te laisser passer. Réfléchis bien.",
    type: "riddle",
    riddle:
      "Je suis le premier Hokage à avoir scellé un démon. Mon nom porte la forêt. Qui suis-je ? (prénom uniquement, en majuscules)",
    icon: "🔮",
  },
  {
    id: 7,
    title: "Le Sceau Final",
    subtitle: "Rassemble les fragments de ton parcours...",
    description:
      "Tu as traversé six épreuves et récolté six indices. La première lettre de chaque réponse forme le dernier code. Assemble-les pour briser le sceau final.",
    type: "final",
    icon: "⛩️",
  },
];

export const MUDRA_SIGNS: MudraSign[] = [
  { name: "Tora", symbol: "🐯", kanji: "寅" },
  { name: "Inu", symbol: "🐕", kanji: "戌" },
  { name: "Tatsu", symbol: "🐉", kanji: "辰" },
  { name: "Usagi", symbol: "🐇", kanji: "卯" },
  { name: "Hitsuji", symbol: "🐑", kanji: "未" },
  { name: "Saru", symbol: "🐵", kanji: "申" },
];
