import { useState } from "react";

interface Props {
  hint: string;
}

export default function HintButton({ hint }: Props) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        style={{
          background: "none",
          border: "none",
          color: "var(--ink-light)",
          opacity: 0.5,
          cursor: "pointer",
          marginTop: "1.5rem",
          fontSize: "0.85rem",
          fontFamily: "'MedievalSharp', serif",
        }}
      >
        💡 Besoin d'un indice ?
      </button>
      {show && (
        <p style={{ color: "var(--blood-red)", marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.9rem", animation: "fadeIn 0.3s ease" }}>
          {hint}
        </p>
      )}
    </>
  );
}
