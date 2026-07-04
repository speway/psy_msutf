import Link from "next/link";
import { cookies } from "next/headers";
import { FileQuestion } from "lucide-react";
import { BauhausBackground } from "@/components/bauhaus-background";

export default async function NotFound() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value;
  const lang = langCookie === "en" || langCookie === "uz" ? langCookie : "ru";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[70vh] flex items-center justify-center">
      <BauhausBackground variant="contacts" />
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bauhaus-ochre/10 flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-bauhaus-ochre" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5">
            404
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase mb-4">
            {lang === "uz"
              ? "Sahifa topilmadi"
              : lang === "en"
                ? "Page not found"
                : "Страница не найдена"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[460px] leading-relaxed mx-auto mb-8">
            {lang === "uz"
              ? "So&rsquo;ralgan sahifa mavjud emas yoki ko&rsquo;chirilgan."
              : lang === "en"
                ? "The requested page does not exist or has been moved."
                : "Запрашиваемая страница не существует или была перемещена."}
          </p>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/60 text-bauhaus-blue rounded-md hover:bg-bauhaus-blue hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
          >
            {lang === "uz"
              ? "Bosh sahifaga"
              : lang === "en"
                ? "Home"
                : "На главную"}
          </Link>
        </div>
      </div>
    </div>
  );
}
