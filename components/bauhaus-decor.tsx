export function BauhausDecor() {
  return (
    <div
      data-decor="true"
      aria-hidden="true"
      className="bauhaus-bg-container pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft ambient atmospheric gradients for depth and polish without visual noise */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute top-1/3 -left-40 h-[450px] w-[450px] rounded-full bg-accent/[0.03] blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
    </div>
  );
}
