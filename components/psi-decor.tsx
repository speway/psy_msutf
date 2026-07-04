export function PsiDecor({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      data-decor="true"
      aria-hidden="true"
      className={`psi-decor-inline pointer-events-none select-none font-black leading-none ${className}`}
      style={{
        color: "var(--decor-secondary)",
        ...style,
      }}
    >
      Ψ
    </span>
  );
}
