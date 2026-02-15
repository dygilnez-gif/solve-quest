import { useState, useEffect } from "react";

interface Props {
  onStart: (name: string) => void;
}

export default function LandingPage({ onStart }: Props) {
  const [name, setName] = useState("");
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimReady(true), 100);
  }, []);

  const canStart = name.trim().length >= 2;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      <div className="kanji-bg" style={{ top: "-5%", left: "-5%", transform: "rotate(-15deg)" }}>
        忍
      </div>
      <div className="kanji-bg" style={{ bottom: "-5%", right: "-5%", transform: "rotate(10deg)" }}>
        火
      </div>

      <div
        style={{
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
          opacity: animReady ? 1 : 0,
          transform: animReady ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="seal-stamp" style={{ margin: "0 auto 1.5rem" }}>火</div>

          <h1
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "var(--parchment-light)",
              letterSpacing: "3px",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
            }}
          >
            LA CHASSE AU
            <br />
            <span style={{ color: "var(--gold)", fontSize: "110%" }}>PARCHEMIN INTERDIT</span>
          </h1>

          <div
            style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              margin: "1rem auto",
              maxWidth: 300,
              opacity: 0.5,
            }}
          />

          <p
            style={{
              color: "var(--parchment)",
              opacity: 0.7,
              fontSize: "1.05rem",
              lineHeight: 1.6,
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            Un parchemin ancien a été dérobé. Sept épreuves te séparent de la vérité.
            Seuls les ninjas les plus habiles de Konoha pourront le retrouver.
          </p>
        </div>

        <div
          className="parchment"
          style={{
            marginTop: "2rem",
            animation: animReady ? "fadeInScale 0.6s ease 0.3s both" : "none",
          }}
        >
          <p style={{ fontSize: "0.95rem", marginBottom: "1.2rem", color: "var(--ink-light)", fontStyle: "italic" }}>
            Identifie-toi, ninja de Konoha
          </p>

          <input
            className="input-ninja"
            type="text"
            placeholder="Ton nom de ninja..."
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && canStart && onStart(name.trim())}
            maxLength={20}
            style={{ marginBottom: "1.2rem" }}
          />

          <button
            className="btn-ninja"
            disabled={!canStart}
            onClick={() => onStart(name.trim())}
            style={{ width: "100%" }}
          >
            ⛩️ Commencer la Chasse
          </button>
        </div>

        <p style={{ color: "var(--parchment)", opacity: 0.35, fontSize: "0.8rem", marginTop: "1.5rem" }}>
          Le temps est compté depuis l'ouverture du jeu. Chaque minute réduit ton score.
        </p>
      </div>
    </div>
  );
}
