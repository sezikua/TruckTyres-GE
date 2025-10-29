import type { Dictionary } from "@/providers/I18nProvider";

export type LanguageCode = "ru" | "ka";

export async function getDictionary(lang: LanguageCode): Promise<Dictionary> {
  switch (lang) {
    case "ru":
      return (await import("./ru")).default;
    case "ka":
      return (await import("./ka")).default;
    default:
      return (await import("./ru")).default;
  }
}



