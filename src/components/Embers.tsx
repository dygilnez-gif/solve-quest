import { useMemo } from "react";

export default function Embers() {
  const embers = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        size: 2 + Math.random() * 4,
        duration: `${2 + Math.random() * 3}s`,
      })),
    []
  );

  return (
    <>
      {embers.map((e) => (
        <div
          key={e.id}
          style={{
            position: "fixed",
            bottom: "-10px",
            left: e.left,
            width: e.size,
            height: e.size,
            background: "radial-gradient(circle, var(--gold-bright), var(--gold))",
            borderRadius: "50%",
            pointerEvents: "none",
            animation: `embers ${e.duration} ease-out infinite`,
            animationDelay: e.delay,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
