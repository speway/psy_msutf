export function BauhausDecor() {
  return (
    <div
      data-decor="true"
      aria-hidden="true"
      className="bauhaus-bg-container inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 bauhaus-bg-pattern bauhaus-entrance-1 opacity-[0.06] md:opacity-100"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bauhaus-bg-diagonal opacity-[0.04] md:opacity-40 bauhaus-entrance-2"
        aria-hidden="true"
      />

      <div
        className="bauhaus-deco-circle absolute -top-32 -right-32 w-96 h-96 border-[3px] opacity-[0.06] md:opacity-40 bauhaus-entrance-2"
        aria-hidden="true"
      />

      <div className="hidden md:block">
        <div
          className="psi-decor-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="psi-decor-lg-tr absolute -top-32 -right-24 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="psi-decor-sm-bl absolute -bottom-20 -left-16 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xs-right absolute top-1/3 right-8 opacity-70 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-bl-rot absolute bottom-1/3 left-12 opacity-60 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-tc absolute top-1/4 left-1/3 opacity-50 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-mid-rot absolute top-3/4 left-1/2 opacity-40 bauhaus-entrance-5"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xs-mid-rot absolute top-1/2 left-2/3 opacity-35 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-tr absolute top-1/6 right-1/3 opacity-45 bauhaus-entrance-3"
          aria-hidden="true"
        />

        <div
          className="msu-tower-bg-decor absolute left-12 bottom-1/4 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="msu-tower-bg-decor-sm absolute right-16 top-32 bauhaus-entrance-4"
          aria-hidden="true"
        />

        <div
          className="bauhaus-deco-circle absolute -bottom-20 -left-20 w-64 h-64 border-2 opacity-30 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-concentric absolute top-1/4 left-1/3 w-32 h-32 opacity-60 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute top-1/3 right-8 w-16 h-16 border border-bauhaus-ochre/10 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute top-24 left-8 w-12 h-12 border opacity-20 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-32 right-12 w-20 h-20 border-2 border-bauhaus-ochre/10 opacity-25 bauhaus-entrance-4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-overlap-square absolute bottom-48 left-1/4 w-16 h-16 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute top-40 left-1/4 opacity-60 bauhaus-entrance-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-40 right-1/3 opacity-40 bauhaus-entrance-3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-24 left-1/2 opacity-30 bauhaus-entrance-4"
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
      </div>
    </div>
  );
}
