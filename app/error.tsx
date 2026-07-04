"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="border-2 border-destructive/30 p-10 max-w-md w-full space-y-6">
        <div className="text-4xl font-black text-destructive">!</div>
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Произошла ошибка
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Что-то пошло не так. Попробуйте обновить страницу.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 border-foreground/60 text-foreground hover:bg-foreground hover:text-background transition-colors min-h-[44px] cursor-pointer"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
