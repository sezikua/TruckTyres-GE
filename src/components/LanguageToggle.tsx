"use client";

import { useI18n } from "@/providers/I18nProvider";
import { useState } from "react";

export default function LanguageToggle() {
  const { lang, t } = useI18n();
  const [loading, setLoading] = useState(false);

  async function setLang(next: "ru" | "ka") {
    if (loading || next === lang) return;
    setLoading(true);
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: next }),
      });
      // перезагрузим страницу для SSR-обновления
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1 border border-white/20 rounded-md overflow-hidden">
      <button
        type="button"
        className={`px-2 py-1 text-sm ${lang === "ru" ? "bg-white text-[#2d3748]" : "text-white"}`}
        onClick={() => setLang("ru")}
        disabled={loading}
      >
        {t("lang.ru")}
      </button>
      <button
        type="button"
        className={`px-2 py-1 text-sm ${lang === "ka" ? "bg-white text-[#2d3748]" : "text-white"}`}
        onClick={() => setLang("ka")}
        disabled={loading}
      >
        {t("lang.ka")}
      </button>
    </div>
  );
}



