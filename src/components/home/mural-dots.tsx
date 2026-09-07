const DOTS = [
  { top: "6%", left: "3%", size: 14, color: "var(--color-fun-pink)" },
  { top: "14%", left: "94%", size: 10, color: "var(--color-accent)" },
  { top: "82%", left: "6%", size: 12, color: "var(--color-fun-blue)" },
  { top: "90%", left: "92%", size: 16, color: "var(--color-secondary)" },
  { top: "45%", left: "-1%", size: 9, color: "var(--color-primary)" },
  { top: "55%", left: "101%", size: 11, color: "var(--color-fun-pink)" },
];

export function MuralDots() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
      aria-hidden="true"
    >
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
          }}
        />
      ))}
    </div>
  );
}
