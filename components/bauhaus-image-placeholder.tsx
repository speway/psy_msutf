interface BauhausImagePlaceholderProps {
  className?: string;
}

export function BauhausImagePlaceholder({
  className = "",
}: BauhausImagePlaceholderProps) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bauhaus-bg-pattern" />
      <div className="absolute inset-0 bauhaus-bg-pattern-dots" />
      <div className="absolute -top-6 -right-6 h-20 w-20 border-2 border-bauhaus-blue/15" />
      <div className="absolute -bottom-4 -left-4 h-14 w-14 rounded-full border-2 border-bauhaus-ochre/15" />
      <span
        className="relative z-10 text-7xl font-black text-bauhaus-blue/15 leading-none"
        aria-hidden="true"
      >
        Ψ
      </span>
      <div className="absolute bottom-4 right-4 h-1 w-16 bg-bauhaus-ochre/20" />
    </div>
  );
}
