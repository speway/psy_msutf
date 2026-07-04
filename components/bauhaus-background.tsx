type BauhausVariant =
  | "home"
  | "glossary"
  | "disciplines"
  | "publications"
  | "archive"
  | "contacts";

interface Props {
  variant: BauhausVariant;
}

function SharedGrid() {
  return (
    <>
      <div className="bauhaus-stripe-layer" aria-hidden="true" />
      <div
        className="absolute inset-0 bauhaus-bg-pattern opacity-[0.04]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bauhaus-bg-diagonal opacity-[0.03]"
        aria-hidden="true"
      />
    </>
  );
}

function HomeBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div className="psi-decor-center" aria-hidden="true" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          aria-hidden="true"
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
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none select-none"
          aria-hidden="true"
          style={{
            width: 380,
            height: 380,
            border: "3px solid var(--decor-primary)",
            opacity: 0.1,
          }}
        />
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none select-none"
          aria-hidden="true"
          style={{
            width: 500,
            height: 500,
            border: "1px dashed var(--decor-accent)",
            opacity: 0.08,
          }}
        />
        <div
          className="bauhaus-ring-lg absolute top-[28%] left-[42%] w-40 h-40 opacity-[0.06]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-h absolute top-[55%] left-[10%] w-48 h-1.5 opacity-[0.06]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-stripe-v absolute top-[15%] right-[15%] w-1 h-36 opacity-[0.06]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-circle absolute -bottom-20 -left-20 w-64 h-64 border-2"
          aria-hidden="true"
        />
        <div
          className="bauhaus-concentric absolute top-1/4 left-1/3 w-32 h-32"
          aria-hidden="true"
        />
        <div
          className="bauhaus-overlap-square absolute bottom-48 left-1/4 w-16 h-16"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute top-40 left-1/4"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-40 right-1/3"
          aria-hidden="true"
        />
        <div
          className="bauhaus-triangle absolute top-32 right-1/4 w-12 h-14"
          aria-hidden="true"
        />
        <div
          className="bauhaus-half-circle bauhaus-half-circle-top absolute top-24 right-1/3 w-20 h-10"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute top-1/3 left-8 w-1 h-24"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute top-16 left-1/3 w-20 h-[3px]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function GlossaryBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div
          className="psi-decor-xxs-tr absolute top-8 right-12 opacity-30"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-bl-rot absolute bottom-16 left-12 opacity-25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="bauhaus-dot-grid-fine absolute inset-0 opacity-[0.04]" />
        </div>
        <div
          className="bauhaus-deco-square absolute top-24 left-[15%] w-10 h-10 border opacity-15"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute top-24 right-[30%] w-8 h-8 border opacity-12"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-32 left-[40%] w-12 h-12 border opacity-10"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-40 right-[20%] w-9 h-9 border opacity-14"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute top-1/3 -right-16 w-48 h-48 border opacity-[0.05]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute -bottom-8 left-1/3 w-32 h-32 border opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute top-1/2 right-1/4 opacity-20"
          aria-hidden="true"
        />
        <div
          className="bauhaus-cross absolute bottom-1/4 left-[8%] opacity-15"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-h absolute top-[45%] right-[5%] w-20 h-px opacity-[0.05]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-stripe-h absolute bottom-[30%] left-[5%] w-16 h-px opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
      </div>
    </>
  );
}

function DisciplinesBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div
          className="psi-decor-xs-mid-rot absolute top-1/2 right-[12%] opacity-25"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-bl-rot absolute bottom-20 left-8 opacity-20"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-v absolute top-[5%] left-[20%] w-px h-[90%] opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-stripe-v absolute top-[10%] left-[35%] w-px h-[80%] opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
        <div
          className="bauhaus-stripe-v absolute top-[8%] left-[65%] w-px h-[84%] opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-stripe-v absolute top-[12%] left-[80%] w-px h-[76%] opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-bar absolute top-[15%] left-[28%] w-[2px] h-32 opacity-[0.06]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-bar absolute top-[55%] left-[72%] w-[2px] h-24 opacity-[0.05]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute top-1/4 left-[50%] w-24 h-24 border opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute bottom-1/4 right-[10%] w-16 h-16 border opacity-[0.035]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute top-1/3 left-[10%] w-8 h-8 border opacity-10"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-1/3 right-[30%] w-6 h-6 border opacity-8"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-h absolute top-[72%] left-[5%] w-24 h-px opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-stripe-h absolute top-[82%] right-[5%] w-16 h-px opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
      </div>
    </>
  );
}

function PublicationsBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div
          className="psi-decor-xs-right absolute top-1/4 right-8 opacity-25"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-tc absolute top-12 left-1/3 opacity-20"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute top-[15%] left-[8%] w-24 h-32 border-2 opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-deco-square absolute top-[35%] left-[14%] w-20 h-28 border-2 opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-deco-square absolute top-[20%] right-[12%] w-28 h-36 border-2 opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-deco-square absolute top-[42%] right-[18%] w-22 h-30 border-2 opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-stripe-h absolute top-[10%] left-[30%] w-40 h-px opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
        <div
          className="bauhaus-stripe-h absolute bottom-[15%] left-[25%] w-32 h-px opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
        <div
          className="bauhaus-stripe-h absolute bottom-[8%] right-[20%] w-24 h-px opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
        <div
          className="bauhaus-stripe-v absolute top-[5%] left-[50%] w-px h-[90%] opacity-[0.025]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-muted)" }}
        />
        <div
          className="bauhaus-dashed-circle absolute bottom-1/3 left-[40%] w-20 h-20 opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-angle absolute top-1/4 left-[5%] w-16 h-16 opacity-[0.05]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-angle absolute bottom-1/4 right-[5%] w-14 h-14 opacity-[0.04]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function ArchiveBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div
          className="psi-decor-sm-bl absolute -bottom-16 -left-12 opacity-25"
          aria-hidden="true"
        />
        <div
          className="psi-decor-xxs-tr absolute top-12 right-16 opacity-20"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute top-1/2 -translate-y-1/2 -right-24 w-80 h-80 border-2 opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-circle absolute -bottom-16 left-1/3 w-48 h-48 border opacity-[0.035]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-concentric absolute top-1/4 left-[15%] w-28 h-28 opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-h absolute top-[55%] left-[8%] w-36 h-px opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-stripe-h absolute top-[65%] right-[5%] w-28 h-px opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-stripe-h absolute top-[75%] left-[12%] w-20 h-px opacity-[0.03]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-diamond-outline absolute top-[15%] right-[25%] w-14 h-14 opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-diamond-outline absolute bottom-[20%] left-[30%] w-10 h-10 opacity-[0.03]"
          aria-hidden="true"
        />
        <div
          className="bauhaus-arch absolute -top-8 right-1/4 w-32 h-16 opacity-[0.04]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function ContactsBackground() {
  return (
    <>
      <SharedGrid />
      <div className="block">
        <div
          className="psi-decor-xxs-bl-rot absolute bottom-16 left-16 opacity-20"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-dot absolute top-[20%] left-[15%] w-2 h-2 opacity-[0.06]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-dot absolute top-[20%] left-[25%] w-2 h-2 opacity-[0.05]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-dot absolute top-[20%] left-[35%] w-2 h-2 opacity-[0.06]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-dot absolute top-[28%] left-[20%] w-2 h-2 opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-dot absolute top-[28%] left-[30%] w-2 h-2 opacity-[0.05]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-primary)" }}
        />
        <div
          className="bauhaus-deco-dot absolute bottom-[30%] right-[20%] w-2 h-2 opacity-[0.05]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-deco-dot absolute bottom-[30%] right-[30%] w-2 h-2 opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-deco-dot absolute bottom-[30%] right-[40%] w-2 h-2 opacity-[0.06]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-deco-dot absolute bottom-[38%] right-[25%] w-2 h-2 opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-deco-dot absolute bottom-[38%] right-[35%] w-2 h-2 opacity-[0.05]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-accent)" }}
        />
        <div
          className="bauhaus-deco-square absolute top-1/3 right-[10%] w-8 h-8 border opacity-10"
          aria-hidden="true"
        />
        <div
          className="bauhaus-deco-square absolute bottom-1/3 left-[8%] w-6 h-6 border opacity-8"
          aria-hidden="true"
        />
        <div
          className="bauhaus-stripe-h absolute top-[10%] left-[60%] w-12 h-px opacity-[0.04]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
        <div
          className="bauhaus-stripe-h absolute bottom-[15%] right-[55%] w-10 h-px opacity-[0.035]"
          aria-hidden="true"
          style={{ backgroundColor: "var(--decor-secondary)" }}
        />
      </div>
    </>
  );
}

const variantMap: Record<BauhausVariant, typeof HomeBackground> = {
  home: HomeBackground,
  glossary: GlossaryBackground,
  disciplines: DisciplinesBackground,
  publications: PublicationsBackground,
  archive: ArchiveBackground,
  contacts: ContactsBackground,
};

export function BauhausBackground({ variant }: Props) {
  const Background = variantMap[variant];

  return (
    <div
      data-decor="true"
      aria-hidden="true"
      className="bauhaus-bg-container fixed inset-0 -z-10 overflow-hidden"
    >
      <Background />
    </div>
  );
}
