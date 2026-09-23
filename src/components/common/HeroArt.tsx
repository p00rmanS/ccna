/** Decorative network illustration for the dashboard hero. Purely visual, hidden from assistive tech. */
export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
      <g className="ha-link">
        <path d="M160 110 L60 50" /><path d="M160 110 L260 50" /><path d="M160 110 L60 170" /><path d="M160 110 L260 170" /><path d="M160 110 L160 30" />
      </g>
      <circle className="ha-core" cx="160" cy="110" r="30" />
      <path className="ha-arrow" d="M160 96 v-8 m-4 4 l4 -4 l4 4 M160 124 v8 m-4 -4 l4 4 l4 -4 M146 110 h-8 m4 -4 l-4 4 l4 4 M174 110 h8 m-4 -4 l4 4 l-4 4" />
      {[[60, 50], [260, 50], [60, 170], [260, 170], [160, 30]].map(([x, y], i) => (
        <g key={i} className="ha-node">
          <rect x={x! - 22} y={y! - 15} width="44" height="30" rx="7" />
          <path d={`M${x! - 10} ${y! + 4} h20 M${x! - 10} ${y! - 3} h20`} />
        </g>
      ))}
      <circle className="ha-pulse" r="4"><animateMotion dur="3.2s" repeatCount="indefinite" path="M60 50 L160 110 L260 170" /></circle>
      <circle className="ha-pulse" r="4"><animateMotion dur="4s" repeatCount="indefinite" path="M260 50 L160 110 L60 170" /></circle>
    </svg>
  );
}
