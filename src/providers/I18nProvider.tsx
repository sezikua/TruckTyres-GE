"use client";

import React, { createContext, useContext, useMemo } from "react";

export type LanguageCode = "ru" | "ka";

export type Dictionary = Record<string, string>;

interface I18nContextValue {
  lang: LanguageCode;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export default function I18nProvider({ lang, dict, children }: { lang: LanguageCode; dict: Dictionary; children: React.ReactNode; }) {
  const t = useMemo(() => {
    return (key: string) => dict[key] ?? key;
  }, [dict]);

  const value = useMemo<I18nContextValue>(() => ({ lang, t }), [lang, t]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}



