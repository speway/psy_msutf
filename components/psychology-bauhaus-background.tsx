export function PsychologyBauhausBackground() {
  return (
    <div
      data-decor="true"
      aria-hidden="true"
      className="bauhaus-bg-container fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="bauhaus-stripe-layer" aria-hidden="true" />
      <div
        className="absolute inset-0 bauhaus-bg-pattern bauhaus-entrance-1 opacity-[0.06] md:opacity-100"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bauhaus-bg-diagonal bauhaus-entrance-2 opacity-[0.04] md:opacity-100"
        aria-hidden="true"
      />

      <div
        className="bauhaus-deco-circle absolute -top-32 -right-32 w-96 h-96 border-[3px] opacity-[0.06] md:opacity-100 bauhaus-entrance-2"
        aria-hidden="true"
      />

      <div className="block">
        <div
          className="psi-decor-center bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="psi-decor-lg-tr bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="psi-decor-sm-bl bauhaus-entrance-4"
          aria-hidden="true"
        />

        {/* Large hero Ψ — bold Bauhaus centerpiece */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bauhaus-entrance-2 pointer-events-none select-none"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          <span
            className="block text-[28rem] font-black leading-none text-center select-none"
            style={{
              color: "var(--decor-secondary)",
              opacity: 0.07,
              lineHeight: 0.8,
              userSelect: "none",
            }}
          >
            Ψ
          </span>
        </div>

        {/* Concentric rings around Ψ — entrance only, no infinite animation */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none select-none bauhaus-entrance-3"
          aria-hidden="true"
          style={{
            width: 380,
            height: 380,
            border: "3px solid var(--decor-primary)",
            opacity: 0.1,
          }}
        />
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none select-none bauhaus-entrance-4"
          aria-hidden="true"
          style={{
            width: 500,
            height: 500,
            border: "1px dashed var(--decor-accent)",
            opacity: 0.08,
          }}
        />
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none select-none bauhaus-entrance-2"
          aria-hidden="true"
          style={{
            width: 260,
            height: 260,
            border: "2px solid var(--decor-muted)",
            opacity: 0.12,
          }}
        />

        {/* Orbital dots — entrance only */}
        <div
          className="absolute pointer-events-none select-none bauhaus-entrance-3"
          aria-hidden="true"
          style={{
            top: "calc(30% - 250px)",
            left: "50%",
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "var(--decor-accent)",
            transform: "translateX(250px)",
            opacity: 0.15,
          }}
        />
        <div
          className="absolute pointer-events-none select-none bauhaus-entrance-4"
          aria-hidden="true"
          style={{
            top: "calc(30% - 190px)",
            left: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "var(--decor-primary)",
            transform: "translateX(190px)",
            opacity: 0.12,
          }}
        />

        {/* Bold geometric shapes — Bauhaus style */}
        <div
          className="bauhaus-ring-lg absolute top-[28%] left-[42%] w-40 h-40 opacity-[0.08] bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-dashed-circle absolute top-[40%] left-[55%] w-28 h-28 opacity-[0.06] bauhaus-entrance-4"
          aria-hidden="true"
        />

        {/* Thick horizontal bars */}
        <div
          className="bauhaus-stripe-h absolute top-[55%] left-[10%] w-48 h-1.5 opacity-[0.08] bauhaus-entrance-3"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-stripe-h absolute top-[62%] right-[8%] w-32 h-1 opacity-[0.06] bauhaus-entrance-4"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />

        {/* Vertical accent bar */}
        <div
          className="bauhaus-stripe-v absolute top-[15%] right-[15%] w-1 h-36 opacity-[0.07] bauhaus-entrance-3"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />

        {/* Bauhaus geometry remnants */}
        <div
          className="bauhaus-deco-circle absolute -bottom-20 -left-20 w-64 h-64 border-2 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-concentric absolute top-1/4 left-1/3 w-32 h-32 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute top-1/3 right-8 w-16 h-16 border bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute top-24 left-8 w-12 h-12 border bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-32 right-12 w-20 h-20 border-2 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-overlap-square absolute bottom-48 left-1/4 w-16 h-16 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute top-40 left-1/4 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-40 right-1/3 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-24 left-1/2 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-triangle absolute top-32 right-1/4 w-12 h-14 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-triangle bauhaus-triangle-rotated absolute bottom-20 right-1/4 w-12 h-14 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-half-circle bauhaus-half-circle-top absolute top-24 right-1/3 w-20 h-10 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-half-circle bauhaus-half-circle-bottom absolute bottom-32 left-1/3 w-16 h-8 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute top-1/3 left-8 w-1 h-24 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute bottom-1/4 right-12 w-1 h-16 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute top-16 left-1/3 w-20 h-[3px] bauhaus-entrance-3"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
