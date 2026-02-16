import { useState, useEffect } from "react";

export default function SecretPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className="scroll-container"
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
        写
      </div>
      <div className="kanji-bg" style={{ bottom: "-5%", right: "-5%", transform: "rotate(10deg)" }}>
        眼
      </div>

      <div
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        <div className="seal-stamp" style={{ margin: "0 auto 1.5rem" }}>眼</div>

        <div className="parchment">
          <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>👁️</div>

          <h2
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "1.2rem",
              color: "var(--ink)",
              letterSpacing: 2,
              marginBottom: "0.5rem",
            }}
          >
            PARCHEMIN SCELLÉ
          </h2>

          <div className="divider" />

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "var(--ink-light)",
              fontStyle: "italic",
              marginBottom: "1.2rem",
            }}
          >
            Tu as trouvé le parchemin caché dans les profondeurs du village.
            Voici le code secret que tu cherches. Retourne sur le site principal
            et entre-le à l'étape 4.
          </p>

          <div className="divider" />

          <p
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: 3,
              opacity: 0.5,
              marginBottom: "0.5rem",
            }}
          >
            Code secret
          </p>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "2.2rem",
              fontWeight: 900,
              color: "var(--blood-red)",
              letterSpacing: 8,
              animation: visible ? "fadeInScale 1.5s ease 0.5s both" : "none",
            }}
          >
            SHARINGAN
          </p>
        </div>

        <p
          style={{
            color: "var(--parchment)",
            opacity: 0.35,
            fontSize: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          ⚠ Ne partage pas ce lieu avec les autres ninjas.
        </p>
      </div>
    </div>
  );
}